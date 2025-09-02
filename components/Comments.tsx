'use client';

import { useSession } from 'next-auth/react';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TrackId } from '../constants.ts';

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

const Comments: React.FC<CommentsProps> = ({ trackId, milestone, signalIndex = null, reportKey }) => {
  const { data: session } = useSession();
  const authorName = session?.user?.name;
  const [items, setItems] = React.useState<CommentItem[]>([]);
  const [text, setText] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [replyOpenFor, setReplyOpenFor] = React.useState<Record<string, boolean>>({});
  const [replyTextById, setReplyTextById] = React.useState<Record<string, string>>({});
  const [composerOpen, setComposerOpen] = React.useState(false);

  const fetchComments = React.useCallback(async () => {
    const params = new URLSearchParams({ trackId, milestone: String(milestone), reportKey, username: authorName });
    if (signalIndex !== null && signalIndex !== undefined) {
      params.set('signalIndex', String(signalIndex));
    }
    const res = await fetch(`/api/comments?${params.toString()}`, { cache: 'no-store' });
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

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || !authorName) return;
    setSubmitting(true);
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
    setText('');
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ trackId, milestone, signalIndex, text: optimistic.text, reportKey, parentId: null }),
      });
      if (!res.ok) throw new Error('Failed request');
      const data = await res.json();
      const created: CommentItem = data.comment;
      setItems((prev) => {
        const withoutTmp = prev.filter((c) => c.id !== optimistic.id);
        return [created, ...withoutTmp];
      });
    } catch {
      // revert optimistic on error
      setItems((prev) => prev.filter((c) => c.id !== optimistic.id));
    } finally {
      setSubmitting(false);
    }
  }

  function toggleReplyBox(commentId: string) {
    setReplyOpenFor((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  }

  async function submitReply(parent: CommentItem) {
    const replyText = (replyTextById[parent.id] || '').trim();
    if (!replyText) return;
    // optimistic insert
    const optimistic: CommentItem = {
      id: `tmp-reply-${parent.id}-${Date.now()}`,
      trackId,
      milestone,
      signalIndex: signalIndex ?? null,
      authorName: authorName?.trim() || 'Anonymous',
      text: replyText,
      createdAt: new Date().toISOString(),
      reportKey,
      parentId: parent.id,
    };
    setItems((prev) => [optimistic, ...prev]);
    setReplyTextById((prev) => ({ ...prev, [parent.id]: '' }));
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ trackId, milestone, signalIndex, text: optimistic.text, reportKey, parentId: parent.id }),
      });
      if (!res.ok) throw new Error('Failed request');
      const data = await res.json();
      const created: CommentItem = data.comment;
      setItems((prev) => {
        const withoutTmp = prev.filter((c) => c.id !== optimistic.id);
        return [created, ...withoutTmp];
      });
    } catch {
      setItems((prev) => prev.filter((c) => c.id !== optimistic.id));
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

  function renderComment(c: CommentItem, depth: number = 0): React.ReactNode {
    const kidList = tree.children.get(c.id) || [];
    const isReplyOpen = !!replyOpenFor[c.id];
    const isRoot = !c.parentId;
    return (
      <div
        key={c.id}
        className={`comment-item`}
        style={{
          marginLeft: depth * 16,
          background: depth === 0 ? '#f7f7f7' : '#f9f9f9',
          border: `1px solid ${depth === 0 ? '#cfcfcf' : '#c8c8c8'}`,
          borderRadius: 6,
          padding: '12px 14px',
          marginBottom: 12,
          boxShadow: '0 1px 0 rgba(0,0,0,0.03)'
        }}
      >
        <div className="meta">
          <strong>{c.authorName || 'Anonymous'}</strong> on {formatDate(c.createdAt)}
        </div>
        <div className="body-text">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{c.text}</ReactMarkdown>
        </div>
        {kidList.length > 0 && (
          <div className="children" style={{ marginTop: 8, display: 'grid', gap: 8, marginLeft: 12, paddingLeft: 12, borderLeft: '2px solid #e6e6e6' }}>
            {kidList.map((k) => renderComment(k, depth + 1))}
          </div>
        )}
        {isRoot && (
          <div className="reply-box">
            {isReplyOpen ? (
              <>
                <textarea
                  value={replyTextById[c.id] || ''}
                  onChange={(e) => setReplyTextById((prev) => ({ ...prev, [c.id]: e.target.value }))}
                  placeholder={"Add a reply"}
                  style={{
                    width: '100%',
                    minHeight: 72,
                    boxSizing: 'border-box',
                    padding: 10,
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontSize: 14,
                    lineHeight: '1.4',
                    border: '1px solid #ddd',
                    borderRadius: 6,
                    background: '#fff',
                  }}
                />
                <div>
                  <button
                    onClick={() => submitReply(c)}
                    disabled={!((replyTextById[c.id] || '').trim())}
                  >
                    Post reply
                  </button>
                  <button onClick={() => toggleReplyBox(c.id)} style={{ marginLeft: 8 }}>
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <button onClick={() => toggleReplyBox(c.id)}>Reply</button>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <style jsx>{`
        .comments {
          border-top: 2px solid #e5e5e5;
          padding-top: 16px;
          margin-top: 16px;
        }
        .comment-item {
          background: #f7f7f7;
          border: 1px solid #cfcfcf;
          border-radius: 6px;
          padding: 12px 14px;
          margin-bottom: 12px;
          box-shadow: 0 1px 0 rgba(0,0,0,0.03);
        }
        
        .meta {
          font-size: 12px;
          color: #555;
          margin-bottom: 6px;
        }
        .body-text { line-height: 1.55; color: #222; }
        .body-text :global(p) { margin: 0 0 8px; }
        .body-text :global(h1),
        .body-text :global(h2),
        .body-text :global(h3),
        .body-text :global(h4),
        .body-text :global(h5),
        .body-text :global(h6) {
          margin: 8px 0 6px;
          line-height: 1.25;
        }
        .body-text :global(ul),
        .body-text :global(ol) {
          margin: 6px 0 8px;
          padding-left: 1.4em;
        }
        .body-text :global(li) { margin: 2px 0; }
        .body-text :global(code) {
          background: #f3f3f3;
          padding: 0 4px;
          border-radius: 4px;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
          font-size: 0.95em;
        }
        .body-text :global(pre) {
          background: #f6f8fa;
          padding: 10px;
          border: 1px solid #e2e2e2;
          border-radius: 6px;
          overflow: auto;
        }
        .body-text :global(blockquote) {
          margin: 8px 0;
          padding-left: 10px;
          border-left: 3px solid #ddd;
          color: #555;
        }
        .body-text :global(a) { color: #1a73e8; text-decoration: underline; }
        .body-text :global(table) {
          border-collapse: collapse;
          margin: 8px 0;
          width: 100%;
        }
        .body-text :global(th),
        .body-text :global(td) {
          border: 1px solid #e2e2e2;
          padding: 6px 8px;
          text-align: left;
        }
        textarea {
          width: 100%;
          min-height: 72px;
          box-sizing: border-box;
          padding: 10px;
          font-family: Helvetica, Arial, sans-serif;
          font-size: 14px;
          line-height: 1.4;
          border: 1px solid #ddd;
          border-radius: 6px;
          background: #fff;
        }
        button {
          margin-top: 8px;
          padding: 6px 10px;
          border: 1px solid #ccc;
          background: #fff;
          cursor: pointer;
          border-radius: 6px;
        }
        button:hover {
          background: #f6f6f6;
        }
        
        .children {
          margin-top: 8px;
          display: grid;
          gap: 8px;
          margin-left: 12px;
          padding-left: 12px;
          border-left: 2px solid #e6e6e6;
        }
        .children .comment-item {
          background: #f9f9f9;
          border: 1px solid #c8c8c8;
        }
        .reply-box {
          margin-top: 12px;
          padding-top: 10px;
          border-top: 1px dashed #eaeaea;
        }
        .reply-box textarea {
          width: 100%;
          min-height: 72px;
          box-sizing: border-box;
          padding: 10px;
          font-family: Helvetica, Arial, sans-serif;
          font-size: 14px;
          line-height: 1.4;
          border: 1px solid #ddd;
          border-radius: 6px;
          background: #fff;
        }
        .new-comment { margin-bottom: 12px; }
      `}</style>
      <div className="comments">
        <div className="new-comment">
          {composerOpen ? (
            <form onSubmit={submit}>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Add a comment"
                disabled={submitting}
              />
              <div>
                <button type="submit" className="primary" disabled={submitting || !text.trim()}>
                  {submitting ? 'Posting…' : 'Post comment'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setComposerOpen(false);
                    setText('');
                  }}
                  style={{ marginLeft: 8 }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button type="button" onClick={() => setComposerOpen(true)}>
              Add comment
            </button>
          )}
        </div>
        <div style={{ marginTop: 12 }}>
          {items.length === 0 ? (
            <div className="meta">No comments yet.</div>
          ) : (
            tree.roots.map((c) => renderComment(c, 0))
          )}
        </div>
      </div>
    </div>
  );
};

export default Comments;


