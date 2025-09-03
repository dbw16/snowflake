'use client';

import { useSession } from 'next-auth/react';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TrackId } from '../constants.ts';
import styles from './Comments.module.css';

interface CommentItem {
  id: string;
  trackId: TrackId;
  milestone: number;
  signalIndex?: number | null;
  authorName: string;
  text: string;
  createdAt: string;
  reportKey: string;
  parentId?: string | null;
}

interface CommentsProps {
  trackId: TrackId;
  milestone: number;
  signalIndex?: number | null;
  reportKey: string;
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return iso;
  }
}

interface ReplyState {
  isOpen: boolean;
  text: string;
  isPending: boolean;
  error: string | null;
}

interface CommentItemComponentProps {
  comment: CommentItem;
  tree: {
    roots: CommentItem[];
    children: Map<string, CommentItem[]>;
  };
  replyState: Record<string, Partial<ReplyState>>;
  setReplyState: React.Dispatch<React.SetStateAction<Record<string, Partial<ReplyState>>>>;
  submitReply: (parent: CommentItem) => Promise<void>;
  toggleReplyBox: (commentId: string) => void;
  depth?: number;
}

const CommentItemComponent: React.FC<CommentItemComponentProps> = ({
  comment,
  tree,
  replyState,
  setReplyState,
  submitReply,
  toggleReplyBox,
  depth = 0,
}) => {
  const kidList = tree.children.get(comment.id) || [];
  const parentId = comment.id;
  const currentReplyState = replyState[parentId] || {};
  const isReplyOpen = !!currentReplyState.isOpen;
  const isRoot = !comment.parentId;

  return (
    <div
      className={[
        styles.commentItem,
        depth === 0 ? styles.commentItemRoot : styles.commentItemChild,
      ].join(' ')}
      style={{ marginLeft: depth * 16 }}
    >
      <div className={styles.meta}>
        <strong>{comment.authorName || 'Anonymous'}</strong> on {formatDate(comment.createdAt)}
      </div>
      <div className={styles.bodyText}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{comment.text}</ReactMarkdown>
      </div>
      {kidList.length > 0 && (
        <div className={styles.children}>
          {kidList.map((k) => (
            <CommentItemComponent
              key={k.id}
              comment={k}
              tree={tree}
              replyState={replyState}
              setReplyState={setReplyState}
              submitReply={submitReply}
              toggleReplyBox={toggleReplyBox}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
      {isRoot && (
        <div className={styles.replyBox}>
          {isReplyOpen ? (
            <>
              <textarea
                value={currentReplyState.text || ''}
                onChange={(e) =>
                  setReplyState((prev) => ({
                    ...prev,
                    [parentId]: { ...prev[parentId], text: e.target.value },
                  }))
                }
                placeholder={"Add a reply"}
                className={styles.textArea}
              />
              <div>
                <button
                  className={styles.button}
                  onClick={() => submitReply(comment)}
                  disabled={
                    currentReplyState.isPending || !((currentReplyState.text || '').trim())
                  }
                >
                  {currentReplyState.isPending ? 'Posting…' : 'Post reply'}
                </button>
                <button className={`${styles.button} ${styles.ml8}`} onClick={() => toggleReplyBox(parentId)}>
                  Cancel
                </button>
              </div>
              {currentReplyState.error && (
                <div className={styles.errorMessage}>
                  {currentReplyState.error}
                </div>
              )}
            </>
          ) : (
            <button className={styles.button} onClick={() => toggleReplyBox(parentId)}>Reply</button>
          )}
        </div>
      )}
    </div>
  );
};

const Comments: React.FC<CommentsProps> = ({ trackId, milestone, signalIndex = null, reportKey }) => {
  const { data: session } = useSession();
  const authorName = session?.user?.name;
  const [items, setItems] = React.useState<CommentItem[]>([]);
  const [text, setText] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [composerOpen, setComposerOpen] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [replyState, setReplyState] = React.useState<Record<string, Partial<ReplyState>>>({});

  const fetchComments = React.useCallback(async () => {
    const params: Record<string, string> = { trackId, milestone: String(milestone), reportKey };
    if (authorName) {
      params.username = authorName;
    }
    const searchParams = new URLSearchParams(params);
    if (signalIndex !== null && signalIndex !== undefined) {
      searchParams.set('signalIndex', String(signalIndex));
    }
    const res = await fetch(`/api/comments?${searchParams.toString()}`);
    if (res.ok) {
      const data = await res.json();
      setItems(data.comments || []);
    } else if (res.status === 403) {
      setItems([]);
    }
  }, [trackId, milestone, reportKey, authorName, signalIndex]);

  React.useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  /**
   * Create a comment via API and return the server-created CommentItem.
   * Responsible only for network / parsing – optimistic logic handled by callers.
   */
  async function createComment(payload: { text: string; parentId: string | null }): Promise<CommentItem> {
    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        trackId,
        milestone,
        signalIndex,
        text: payload.text,
        reportKey,
        parentId: payload.parentId,
      }),
    });
    if (!res.ok) throw new Error(`Failed request: ${res.status}`);
    const data = await res.json();
    return data.comment as CommentItem;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || !authorName) return;
    setSubmitting(true);
    setError(null);
    const optimistic: CommentItem = {
      id: `tmp-${Date.now()}`,
      trackId,
      milestone,
      signalIndex: signalIndex ?? null,
      authorName: authorName?.trim() || 'Anonymous',
      text: text.trim(),
      createdAt: new Date().toISOString(),
      reportKey,
      parentId: null,
    };
    setItems((prev) => [optimistic, ...prev]);
    const originalText = text;
    setText('');
    try {
      const created = await createComment({ text: optimistic.text, parentId: null });
      setItems((prev) => prev.map((c) => (c.id === optimistic.id ? created : c)));
    } catch {
      setError('Failed to post comment. Please try again.');
      setText(originalText);
      setItems((prev) => prev.filter((c) => c.id !== optimistic.id));
    } finally {
      setSubmitting(false);
    }
  }

  function toggleReplyBox(commentId: string) {
    setReplyState((prev) => ({
      ...prev,
      [commentId]: { ...prev[commentId], isOpen: !prev[commentId]?.isOpen },
    }));
  }

  async function submitReply(parent: CommentItem) {
    const parentId = parent.id;
    const state = replyState[parentId] || {};
    const replyText = (state.text || '').trim();

    if (!replyText || !authorName || state.isPending) return;

    const tempId = `tmp-reply-${parentId}-${(globalThis as any)?.crypto?.randomUUID?.() || Date.now()}`;
    const optimistic: CommentItem = {
      id: tempId,
      trackId,
      milestone,
      signalIndex: signalIndex ?? null,
      authorName: authorName.trim() || 'Anonymous',
      text: replyText,
      createdAt: new Date().toISOString(),
      reportKey,
      parentId: parentId,
    };

    // optimistic insert
    setItems((prev) => [optimistic, ...prev]);
    setReplyState((prev) => ({
      ...prev,
      [parentId]: { ...prev[parentId], text: '', isPending: true, error: null },
    }));

    try {
      const created = await createComment({ text: optimistic.text, parentId: parentId });
      setItems((prev) => prev.map((c) => (c.id === tempId ? created : c)));
    } catch (err) {
      // rollback + restore text for retry
      setItems((prev) => prev.filter((c) => c.id !== tempId));
      setReplyState((prev) => ({
        ...prev,
        [parentId]: { ...prev[parentId], text: replyText, error: 'Failed to post reply. Try again.' },
      }));
    } finally {
      setReplyState((prev) => ({
        ...prev,
        [parentId]: { ...prev[parentId], isPending: false },
      }));
    }
  }

  // Build a tree for rendering threaded replies
  const tree = React.useMemo(() => {
    const byId = new Map<string, CommentItem>();
    const children = new Map<string, CommentItem[]>();
    const roots: CommentItem[] = [];
    for (const c of items) {
      byId.set(c.id, c);
    }
    for (const c of items) {
      const p = c.parentId || null;
      if (!p) {
        roots.push(c);
      } else {
        const arr = children.get(p) || [];
        arr.push(c);
        children.set(p, arr);
      }
    }
    // Sort roots newest first, children oldest first for readability
    roots.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
    for (const arr of children.values()) {
      arr.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
    }
    return { roots, children } as const;
  }, [items]);

  return (
    <div>
      <div className={styles.comments}>
        <div className={styles.newComment}>
          {composerOpen ? (
            <form onSubmit={submit}>
              <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Add a comment" disabled={submitting} className={styles.textArea} />
              <div>
                <button type="submit" className={styles.button} disabled={submitting || !text.trim()}>
                  {submitting ? 'Posting…' : 'Post comment'}
                </button>
                <button type="button" onClick={() => { setComposerOpen(false); setText(''); setError(null); }} className={`${styles.button} ${styles.ml8}`}>
                  Cancel
                </button>
              </div>
              {error && <div className={styles.errorMessage}>{error}</div>}
            </form>
          ) : (
            <button type="button" onClick={() => setComposerOpen(true)} className={styles.button}>
              Add comment
            </button>
          )}
        </div>
        <div style={{ marginTop: 12 }}>
          {items.length === 0 ? (
            <div className={styles.meta}>No comments yet.</div>
          ) : (
            tree.roots.map((c) => (
              <CommentItemComponent
                key={c.id}
                comment={c}
                tree={tree}
                replyState={replyState}
                setReplyState={setReplyState}
                submitReply={submitReply}
                toggleReplyBox={toggleReplyBox}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Comments;


