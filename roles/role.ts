import {scaleOrdinal} from 'd3'

export type Category = 'a' | 'b' | 'c' | 'd'

export const categoryColorScale = scaleOrdinal<string, string>()
  .domain(['a', 'b', 'c', 'd'])
  .range(['#00abc2', '#428af6', '#e1439f', '#e54552']);

export class Milestone {
  summary: string;
  signals: string[];

  constructor(milestone: { summary: string, signals: string[] }) {
    this.summary = milestone.summary;
    this.signals = milestone.signals;
  }
}

export class Track {
  id: string;
  displayName: string;
  category: Category;
  description: string;
  milestones: Milestone[];

  constructor(track: {id: string ,displayName: string, category: Category, description: string, milestones: Milestone[] }) {
    this.id = track.id
    this.displayName = track.displayName;
    this.category = track.category;
    this.description = track.description;
    this.milestones = track.milestones;
  }
}

export class Title {
  label: string;
  minPoints: number;
  maxPoints: number;
  
  constructor(title: { label: string, minPoints: number, maxPoints: number }) {
    this.label = title.label;
    this.minPoints = title.minPoints;
    this.maxPoints = title.maxPoints;
  }
}

export class Role {
  name: string  ;
  tracks: Track[];
  titles: Title[];
  max_points: number;
  constructor(role: { name: string, tracks: Track[], titles: Title[], max_points: number }) {
    this.name = role.name;
    this.tracks = role.tracks;
    this.titles = role.titles;
    this.max_points = role.max_points;
  }

  // get all track ids for this role
  getTrackIds(): string[] {
    return this.tracks.map(track => track.id);
  }

  // get track from track id
  getTrackById(trackId: string): Track {
    const track = this.tracks.find(track => track.id === trackId);
    if (!track) {
      throw new Error(`Track with id ${trackId} not found`);
    }
    return track;
  }

  // returns a map of track ids to zero eg {'WEB_CLIENT': 0, 'MOBILE': 0...}
  getMapOfTrackIdsToZero(): { [key: string]: number } {
    return Object.fromEntries(this.getTrackIds().map(id => [id, 1]));
  }

  getFirstTrackId(): string {
    return this.tracks[0].id;
  }

  // given a map of track ids to milestone levels, return the eligible titles
  // eg  {'WEB_CLIENT': 5, 'MOBILE': 4...} -> ['Engineer I', 'Engineer II']
  eligibleTitlesCalculator(milestoneMap: { [key: string]: number }): string[] {
    const totalPoints = this.totalPointsFromMilestoneMap(milestoneMap);

    return this.titles
      .filter(title => totalPoints >= title.minPoints && totalPoints <= title.maxPoints)
      .map(title => title.label);
  }

  // given a map of track ids to milestone levels, return the total points
  totalPointsFromMilestoneMap(milestoneMap: { [key: string]: number }): number {
    return this.getTrackIds()
      .map(trackId => this.milestoneToPoints(milestoneMap[trackId]))
      .reduce((sum, addend) => sum + addend, 0);
  }

  // given a map of track ids to milestone levels, return the points by category
  // eg {'WEB_CLIENT': 5, 'MOBILE': 4...} -> [ { categoryId: 'a', points: 32 }, { categoryId: 'b', points: 10 } ]
  categoryPointsFromMilestoneMap(milestoneMap: { [key: string]: number }): { categoryId: Category, points: number }[] {
    const pointsByCategory: { [key: string]: number } = {};

    for (const track of this.tracks) {
      const milestone = milestoneMap[track.id] || 0;
      const points = this.milestoneToPoints(milestone);
      pointsByCategory[track.category] = (pointsByCategory[track.category] || 0) + points;
    }

    const allCategories: Category[] = ['a', 'b', 'c', 'd'];
    return allCategories.map(category => ({
      categoryId: category,
      points: pointsByCategory[category] || 0,
    }));
  }

  // converts a milestone level to a point value
  private milestoneToPoints(milestone: number): number {
    switch (milestone) {
      case 0: return 0;
      case 1: return 1;
      case 2: return 3;
      case 3: return 6;
      case 4: return 12;
      case 5: return 20;
      default: return 0;
    }
  }
  
}




// import { tracks, titles, MilestoneMap, Milestone, trackIds, categoryIds} from '../roles/constants'

// export const eligibleTitles = (milestoneMap: MilestoneMap): string[] => {
//   const totalPoints = totalPointsFromMilestoneMap(milestoneMap)

//   return titles.filter(title => (title.minPoints === undefined || totalPoints >= title.minPoints)
//                              && (title.maxPoints === undefined || totalPoints <= title.maxPoints))
//     .map(title => title.label)
// }



// export const categoryPointsFromMilestoneMap = (milestoneMap: MilestoneMap) => {
//   let pointsByCategory = new Map()
//   trackIds.forEach((trackId) => {
//     const milestone = milestoneMap[trackId]
//     const categoryId = tracks[trackId].category
//     let currentPoints = pointsByCategory.get(categoryId) || 0
//     pointsByCategory.set(categoryId, currentPoints + milestoneToPoints(milestone))
//   })
//   return Array.from(categoryIds.values()).map(categoryId => {
//     const points = pointsByCategory.get(categoryId)
//     return { categoryId, points: pointsByCategory.get(categoryId) || 0 }
//   })
// }


// export const milestoneToPoints = (milestone: Milestone): number => {
//   switch (milestone) {
//     case 0: return 0
//     case 1: return 1
//     case 2: return 3
//     case 3: return 6
//     case 4: return 12
//     case 5: return 20
//     default: return 0
//   }
// }

// export const totalPointsFromMilestoneMap = (milestoneMap: MilestoneMap): number =>
//   trackIds.map(trackId => milestoneToPoints(milestoneMap[trackId]))
//     .reduce((sum, addend) => (sum + addend), 0)
