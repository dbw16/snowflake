import { Role, Track, Title, categoryColorScale } from '../role';

describe('Role', () => {
  const tracks: Track[] = [
    new Track({ id: 'WEB_CLIENT', displayName: 'Web Client', category: 'a', description: '', milestones: [] }),
    new Track({ id: 'API', displayName: 'API', category: 'b', description: '', milestones: [] }),
  ];

  const titles: Title[] = [
    new Title({ label: 'Engineer I', minPoints: 0, maxPoints: 10 }),
    new Title({ label: 'Engineer II', minPoints: 11, maxPoints: 20 }),
    new Title({ label: 'Senior Engineer', minPoints: 21, maxPoints: 100 }),
  ];

  const role = new Role({ name: 'Software Engineer', tracks, titles, max_points: 120 });

  describe('getTrackIds', () => {
    it('should return all track ids', () => {
      expect(role.getTrackIds()).toEqual(['WEB_CLIENT', 'API']);
    });
  });

  describe('getMapOfTrackIdsToZero', () => {
    it('should return a map of track ids to zero', () => {
      expect(role.getMapOfTrackIdsToZero()).toEqual({ 'WEB_CLIENT': 0, 'API': 0 });
    });
  });

  describe('getFirstTrackId', () => {
    it('should return the first track id', () => {
      expect(role.getFirstTrackId()).toEqual('WEB_CLIENT');
    });
  });

  describe('eligibleTitlesCalculator', () => {
    it('should return "Engineer I" for 4 points', () => {
      const milestoneMap = { 'WEB_CLIENT': 1, 'API': 2 }; // 1 + 3 = 4 points
      expect(role.eligibleTitlesCalculator(milestoneMap)).toEqual(['Engineer I']);
    });

    it('should return "Engineer II" for 12 points', () => {
      const milestoneMap = { 'WEB_CLIENT': 3, 'API': 3 }; // 6 + 6 = 12 points
      expect(role.eligibleTitlesCalculator(milestoneMap)).toEqual(['Engineer II']);
    });

    it('should return "Senior Engineer" for 32 points', () => {
      const milestoneMap = { 'WEB_CLIENT': 4, 'API': 5 }; // 12 + 20 = 32 points
      expect(role.eligibleTitlesCalculator(milestoneMap)).toEqual(['Senior Engineer']);
    });

    it('should return an empty array when no titles are eligible', () => {
      const titlesWithGap = [
        new Title({ label: 'Junior', minPoints: 0, maxPoints: 5 }),
        new Title({ label: 'Mid-Level', minPoints: 10, maxPoints: 15 }),
      ];
      const roleWithGap = new Role({ name: 'Test', tracks, titles: titlesWithGap, max_points: 20 });
      const milestoneMap = { 'WEB_CLIENT': 3, 'API': 0 }; // 6 points
      expect(roleWithGap.eligibleTitlesCalculator(milestoneMap)).toEqual([]);
    });
  });

  describe('categoryPointsFromMilestoneMap', () => {
    it('should correctly calculate points for each category', () => {
      const milestoneMap = { 'WEB_CLIENT': 1, 'API': 2 }; // cat 'a': 1pt, cat 'b': 3pts
      const expected = [
        { categoryId: 'a', points: 1 },
        { categoryId: 'b', points: 3 },
        { categoryId: 'c', points: 0 },
        { categoryId: 'd', points: 0 },
      ];
      expect(role.categoryPointsFromMilestoneMap(milestoneMap)).toEqual(expect.arrayContaining(expected));
    });

    it('should handle higher milestone levels', () => {
      const milestoneMap = { 'WEB_CLIENT': 4, 'API': 5 }; // cat 'a': 12pts, cat 'b': 20pts
      const expected = [
        { categoryId: 'a', points: 12 },
        { categoryId: 'b', points: 20 },
        { categoryId: 'c', points: 0 },
        { categoryId: 'd', points: 0 },
      ];
      expect(role.categoryPointsFromMilestoneMap(milestoneMap)).toEqual(expect.arrayContaining(expected));
    });

    it('should handle missing milestones for some tracks', () => {
      const milestoneMap = { 'WEB_CLIENT': 3 }; // cat 'a': 6pts, cat 'b': 0pts
      const expected = [
        { categoryId: 'a', points: 6 },
        { categoryId: 'b', points: 0 },
        { categoryId: 'c', points: 0 },
        { categoryId: 'd', points: 0 },
      ];
      expect(role.categoryPointsFromMilestoneMap(milestoneMap)).toEqual(expect.arrayContaining(expected));
    });

    it('should return all categories with 0 points if milestone map is empty', () => {
      const milestoneMap = {};
      const expected = [
        { categoryId: 'a', points: 0 },
        { categoryId: 'b', points: 0 },
        { categoryId: 'c', points: 0 },
        { categoryId: 'd', points: 0 },
      ];
      expect(role.categoryPointsFromMilestoneMap(milestoneMap)).toEqual(expect.arrayContaining(expected));
    });
  });
});

describe('categoryColorScale', () => {
  it('should be defined', () => {
    expect(categoryColorScale).toBeDefined();
  });

  it('should return the correct color for category "a"', () => {
    const result = categoryColorScale('a');
    console.log('categoryColorScale("a"):', result);
    expect(result).toBe('#00abc2');
  });

  it('should return the correct color for category "b"', () => {
    expect(categoryColorScale('b')).toBe('#428af6');
  });

  it('should return the correct color for category "c"', () => {
    expect(categoryColorScale('c')).toBe('#e1439f');
  });

  it('should return the correct color for category "d"', () => {
    expect(categoryColorScale('d')).toBe('#e54552');
  });
});
