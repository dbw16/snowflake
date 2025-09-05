import * as d3 from 'd3'

export type RoleId = 'engineering' | 'cook' | 'cleaner'

export type EngineeringTrackId = 'MOBILE' | 'WEB_CLIENT' | 'FOUNDATIONS' | 'SERVERS' |
  'PROJECT_MANAGEMENT' | 'COMMUNICATION' | 'CRAFT' | 'INITIATIVE' |
  'CAREER_DEVELOPMENT' | 'ORG_DESIGN' | 'WELLBEING' | 'ACCOMPLISHMENT' |
  'MENTORSHIP' | 'EVANGELISM' | 'RECRUITING' | 'COMMUNITY'

export type CookTrackId = 'CULINARY_SKILLS' | 'FOOD_SAFETY' | 'MENU_PLANNING' | 'KITCHEN_MANAGEMENT' |
  'PROJECT_MANAGEMENT' | 'COMMUNICATION' | 'CRAFT' | 'INITIATIVE' |
  'CAREER_DEVELOPMENT' | 'ORG_DESIGN' | 'WELLBEING' | 'ACCOMPLISHMENT' |
  'MENTORSHIP' | 'EVANGELISM' | 'RECRUITING' | 'COMMUNITY'

export type CleanerTrackId = 'CLEANING_TECHNIQUES' | 'EQUIPMENT_MAINTENANCE' | 'SAFETY_PROTOCOLS' | 'EFFICIENCY' |
  'PROJECT_MANAGEMENT' | 'COMMUNICATION' | 'CRAFT' | 'INITIATIVE' |
  'CAREER_DEVELOPMENT' | 'ORG_DESIGN' | 'WELLBEING' | 'ACCOMPLISHMENT' |
  'MENTORSHIP' | 'EVANGELISM' | 'RECRUITING' | 'COMMUNITY'

export type TrackId = EngineeringTrackId | CookTrackId | CleanerTrackId

export type Milestone = 0 | 1 | 2 | 3 | 4 | 5

export type EngineeringMilestoneMap = {
  'MOBILE': Milestone,
  'WEB_CLIENT': Milestone,
  'FOUNDATIONS': Milestone,
  'SERVERS': Milestone,
  'PROJECT_MANAGEMENT': Milestone,
  'COMMUNICATION': Milestone,
  'CRAFT': Milestone,
  'INITIATIVE': Milestone,
  'CAREER_DEVELOPMENT': Milestone,
  'ORG_DESIGN': Milestone,
  'WELLBEING': Milestone,
  'ACCOMPLISHMENT': Milestone,
  'MENTORSHIP': Milestone,
  'EVANGELISM': Milestone,
  'RECRUITING': Milestone,
  'COMMUNITY': Milestone
}

export type CookMilestoneMap = {
  'CULINARY_SKILLS': Milestone,
  'FOOD_SAFETY': Milestone,
  'MENU_PLANNING': Milestone,
  'KITCHEN_MANAGEMENT': Milestone,
  'PROJECT_MANAGEMENT': Milestone,
  'COMMUNICATION': Milestone,
  'CRAFT': Milestone,
  'INITIATIVE': Milestone,
  'CAREER_DEVELOPMENT': Milestone,
  'ORG_DESIGN': Milestone,
  'WELLBEING': Milestone,
  'ACCOMPLISHMENT': Milestone,
  'MENTORSHIP': Milestone,
  'EVANGELISM': Milestone,
  'RECRUITING': Milestone,
  'COMMUNITY': Milestone
}

export type CleanerMilestoneMap = {
  'CLEANING_TECHNIQUES': Milestone,
  'EQUIPMENT_MAINTENANCE': Milestone,
  'SAFETY_PROTOCOLS': Milestone,
  'EFFICIENCY': Milestone,
  'PROJECT_MANAGEMENT': Milestone,
  'COMMUNICATION': Milestone,
  'CRAFT': Milestone,
  'INITIATIVE': Milestone,
  'CAREER_DEVELOPMENT': Milestone,
  'ORG_DESIGN': Milestone,
  'WELLBEING': Milestone,
  'ACCOMPLISHMENT': Milestone,
  'MENTORSHIP': Milestone,
  'EVANGELISM': Milestone,
  'RECRUITING': Milestone,
  'COMMUNITY': Milestone
}

export type MilestoneMap = Partial<Record<TrackId, Milestone>>
export const milestones = [0, 1, 2, 3, 4, 5]

export const milestoneToPoints = (milestone: Milestone): number => {
  switch (milestone) {
    case 0: return 0
    case 1: return 1
    case 2: return 3
    case 3: return 6
    case 4: return 12
    case 5: return 20
    default: return 0
  }
}

export const pointsToLevels = {
  '0': '1.1',
  '5': '1.2',
  '11': '1.3',
  '17': '2.1',
  '23': '2.2',
  '29': '2.3',
  '36': '3.1',
  '43': '3.2',
  '50': '3.3',
  '58': '4.1',
  '66': '4.2',
  '74': '4.3',
  '90': '5.1',
  '110': '5.2',
  '135': '5.3',
}

export const maxLevel = 135

export type Track = {
  displayName: string,
  category: string,
  description: string,
  milestones: {
    summary: string,
    signals: string[],
    examples: string[]
  }[]
}

type EngineeringTracks = {
  'MOBILE': Track,
  'WEB_CLIENT': Track,
  'FOUNDATIONS': Track,
  'SERVERS': Track,
  'PROJECT_MANAGEMENT': Track,
  'COMMUNICATION': Track,
  'CRAFT': Track,
  'INITIATIVE': Track,
  'CAREER_DEVELOPMENT': Track,
  'ORG_DESIGN': Track,
  'WELLBEING': Track,
  'ACCOMPLISHMENT': Track,
  'MENTORSHIP': Track,
  'EVANGELISM': Track,
  'RECRUITING': Track,
  'COMMUNITY': Track
}

type CookTracks = {
  'CULINARY_SKILLS': Track,
  'FOOD_SAFETY': Track,
  'MENU_PLANNING': Track,
  'KITCHEN_MANAGEMENT': Track,
  'PROJECT_MANAGEMENT': Track,
  'COMMUNICATION': Track,
  'CRAFT': Track,
  'INITIATIVE': Track,
  'CAREER_DEVELOPMENT': Track,
  'ORG_DESIGN': Track,
  'WELLBEING': Track,
  'ACCOMPLISHMENT': Track,
  'MENTORSHIP': Track,
  'EVANGELISM': Track,
  'RECRUITING': Track,
  'COMMUNITY': Track
}

type CleanerTracks = {
  'CLEANING_TECHNIQUES': Track,
  'EQUIPMENT_MAINTENANCE': Track,
  'SAFETY_PROTOCOLS': Track,
  'EFFICIENCY': Track,
  'PROJECT_MANAGEMENT': Track,
  'COMMUNICATION': Track,
  'CRAFT': Track,
  'INITIATIVE': Track,
  'CAREER_DEVELOPMENT': Track,
  'ORG_DESIGN': Track,
  'WELLBEING': Track,
  'ACCOMPLISHMENT': Track,
  'MENTORSHIP': Track,
  'EVANGELISM': Track,
  'RECRUITING': Track,
  'COMMUNITY': Track
}

export const engineeringTracks: EngineeringTracks = {
  "MOBILE": {
    "displayName": "Mobile",
    "category": "A",
    "description": "Develops expertise in native mobile platform engineering, such as iOS or Android",
    "milestones": [{
      "summary": "Works effectively within established iOS or Android architectures, following current best practices",
      "signals": [
        "Delivers features requiring simple local modifications",
        "Adds simple actions that call server endpoints",
        "Reuses existing components appropriately",
      ],
      "examples": [
        "Added existing button to a different iOS surface",
        "Add follow button for publications on Android",
        "Fetched and displayed a new stream, using existing stream item styles",
      ],
    }, {
      "summary": "Develops new instances of existing architecture, or minor improvements to existing architecture",
      "signals": [
        "Defines new useful and appropriate proto-generated objects",
        "Creates simple new activities on Android",
        "Migrates code from old patterns to new patterns",
      ],
      "examples": [
        "Upgraded SDWebImage to a new major version",
        "Added support for rendering a new type of stream item",
        "Prototyped a simple new feature quickly",
      ],
    }, {
      "summary": "Designs major new features and demonstrates a nuanced understanding of mobile platform constraints",
      "signals": [
        "Implements complex features with a large product surface area",
        "Works effectively with  Android reactive programming framework",
        "Adds support for new iOS features after a major iOS version upgrade",
      ],
      "examples": [
        "Designed iOS caching strategy for offline reading",
        "Built series reader on Android",
        "Informed the team about recent best practice changes and deprecations",
      ],
    }, {
      "summary": "Builds complex, reusable architectures that pioneer best practices and enable engineers to work more effectively",
      "signals": [
        "Pioneers architecture migration strategies that reduce programmer burden",
        "Fixes subtle memory management issues",
        "Implements interactive dismissals that bring delight",
      ],
      "examples": [
        "Upgraded CocoaPods to a new major version",
        "Designed architecture for fetching and rendering stream items",
        "Migrated Android persistance layer to reactive programming",
      ],
    }, {
      "summary": "Is an industry-leading expert in mobile engineering or sets strategic mobile direction for an eng team",
      "signals": [
        "Defines long-term goals and ensures active projects are in service of them",
        "Designs and builds innovative, industry-leading UI interactions",
        "Invents new techniques to responsibly stretch limits of the Android platform",
      ],
      "examples": [
        "Defined and drove complete migration plan to Swift or Kotlin",
        "Implemented Android recycler views before platform support existed",
        "Pioneered application-level abstractions for multi-app environment",
      ],
    }],
  },

  "WEB_CLIENT": {
    "displayName": "Web client",
    "category": "A",
    "description": "Develops expertise in web client technologies, such as HTML, CSS, and JavaScript",
    "milestones": [{
      "summary": "Works effectively within established web client architectures, following current best practices",
      "signals": [
        "Makes minor modifications to existing screens",
        "Fixes simple design quality issues",
        "Uses CSS appropriately, following style guide",
      ],
      "examples": [
        "Implemented sticky footer on the post page",
        "Hooked up the action to dismiss a post from a stream",
        "Built PaymentHistory screen using ResponseScreen",
      ],
    }, {
      "summary": "Develops new instances of existing architecture, or minor improvements to existing architecture",
      "signals": [
        "Makes sensible abstractions based on template and code patterns",
        "Specs and builds interactive components independently",
        "Prototypes simple new features quickly",
      ],
      "examples": [
        "Built credit card input component",
        "Created shared buttons template",
        "Built modal system",
      ],
    }, {
      "summary": "Designs major new features and demonstrates a nuanced understanding of browser constraints",
      "signals": [
        "Provides useful design feedback and suggests feasible alternatives",
        "Performs systemic tasks to significantly minimise bundle size",
        "Acts a caretaker for all of web client code",
      ],
      "examples": [
        "Designed font loading strategy for Medium",
        "Researched utility of service workers for Medium",
        "Designed and implemented ResponseScreen",
      ],
    }, {
      "summary": "Builds complex, reusable architectures that pioneer best practices and enable engineers to work more effectively",
      "signals": [
        "Pioneers architecture migrations that reduce programmer burden",
        "Implements complex UI transitions that bring delight",
        "Makes architectural decisions that eliminate entire classes of bugs",
      ],
      "examples": [
        "Designed Medium's post morpher and delta system",
        "Implemented Medium's scrolling text over image blur",
        "Designed and pioneered proto-based model storage",
      ],
    }, {
      "summary": "Is an industry-leading expert in web client or sets strategic web client direction for an eng team",
      "signals": [
        "Invents new techniques to innovate and overcome browser constraints",
        "Identifies and solved systemic problems with current architecture",
        "Defines a long-term vision for web client and ensures projects are in service of it",
      ],
      "examples": [
        "Invented CSS in JS",
        "Defined and drove migration strategy to Lite",
        "Implemented unidirectional data flow to completion",
      ],
    }],
  },

  "FOUNDATIONS": {
    "displayName": "Foundations",
    "category": "A",
    "description": "Develops expertise in foundational systems, such as deployments, pipelines, databases and machine learning",
    "milestones": [{
      "summary": "Works effectively within established structures, following current best practices",
      "signals": [
        "Writes thorough postmortems for service outages",
        "Makes simple configuration changes to services",
        "Performs backfills safely and effectively, without causing pages",
      ],
      "examples": [
        "Made safe and effective Ansible changes",
        "Implemented new ETL pipelines based on existing ones",
        "Resolved out of disk errors independently",
      ],
    }, {
      "summary": "Develops new instances of existing architecture, or minor improvements to existing architecture",
      "signals": [
        "Made minor version upgrades to technologies",
        "Builds machine learning jobs within the ML framework",
        "Triages service issues correctly and independently",
      ],
      "examples": [
        "Upgraded NodeJS from 8.0 to 8.1.1",
        "Built custom packages for RPMs",
        "Improved ETL efficiency by improving Dynamo to S3 loading",
      ],
    }, {
      "summary": "Designs standalone systems of moderate complexity, or major new features in existing systems",
      "signals": [
        "Acts as primary maintainer for existing critical systems",
        "Designs moderately complex systems",
        "Makes major version upgrades to libraries",
      ],
      "examples": [
        "Designed Ansible configuration management",
        "Built Medium's realtime stats pipeline",
        "Designed flexible framework for writing machine learning jobs",
      ],
    }, {
      "summary": "Builds complex, reusable architectures that pioneer best practices for other engineers, or multi-system services",
      "signals": [
        "Designs complex projects that encompass multiple systems and technologies",
        "Demonstrates deep knowledge of foundational systems",
        "Introduces new databases and technologies to meet underserved needs",
      ],
      "examples": [
        "Designed and built BBFD",
        "Designed AWS configuration management",
        "Introduced Kinesis and pioneered streaming events pipeline",
      ],
    }, {
      "summary": "Is an industry-leading expert in foundational engineering or sets strategic foundational direction for an eng team",
      "signals": [
        "Designs transformational projects in service of long-term goals",
        "Defines the strategic vision for foundational work and supporting technologies",
        "Invents industry-leading techniques to solve complex problems",
      ],
      "examples": [
        "Invented a novel ML technique that advanced the state of the art",
        "Defined and developed Medium's continuous delivery strategy",
        "Developed and implemented HA strategy",
      ],
    }],
  },

  "SERVERS": {
    "displayName": "Servers",
    "category": "A",
    "description": "Develops expertise in server side engineering, using technologies such as Go, NodeJS, or Scala",
    "milestones": [{
      "summary": "Works effectively within established server side frameworks, following current best practices",
      "signals": [
        "Adds NodeJS endpoints using layers architecture",
        "Adds golang endpoints using Gotham architecture",
        "Makes minor server changes to support client needs",
      ],
      "examples": [
        "Added IFTTT trigger for new bookmark to medium2",
        "Added delete audio route to Buggle",
        "Queried a Dynamo LSI appropriately",
      ],
    }, {
      "summary": "Develops new instances of existing architecture, or minor improvements to existing architecture",
      "signals": [
        "Assesses correctness and utility of existing code and avoids blind copy-pasting",
        "Generalizes code when appropriate",
        "Determines data needs from product requirements",
      ],
      "examples": [
        "Identified need for new index on Dynamo",
        "Acted as caretaker for routes protos",
        "Updated Facebook API version and codebase dependencies",
      ],
    }, {
      "summary": "Designs standalone systems of moderate complexity, or major new features in existing systems",
      "signals": [
        "Acts as primary maintainer for existing critical systems",
        "Integrates third party services effectively",
        "Writes playbooks for new service maintenance",
      ],
      "examples": [
        "Implemented Google Auth login to Medium",
        "Implemented payments integration with Stripe",
        "Built Textshots server",
      ],
    }, {
      "summary": "Builds complex, reusable architectures that pioneer best practices for other engineers, or multi-system services",
      "signals": [
        "Delivers complex systems that achieve their goals",
        "Avoids subtle architectural mistakes when considering new systems",
        "Makes appropriate buy vs build choices",
      ],
      "examples": [
        "Designed Medium's ranked feed architecture",
        "Designed custom domains architecture",
        "Created Gotham framework for creating Go services",
      ],
    }, {
      "summary": "Is an industry-leading expert in server side engineering or sets strategic server side direction for an eng team",
      "signals": [
        "Designs transformational projects of significant complexity and scope",
        "Makes decisions that have positive, long term, wide ranging consequences",
        "Identifies and solves systemic problems with current architecture",
      ],
      "examples": [
        "Researched, vetted, and selected Go as Medium's statically typed language",
        "Defined microservices architecture and medium2 migration plan",
        "Defined and implemented proprietary IP core to the company's success",
      ],
    }],
  },

  "PROJECT_MANAGEMENT": {
    "displayName": "Project management",
    "category": "B",
    "description": "Delivers well-scoped programs of work that meet their goals, on time, to budget, harmoniously",
    "milestones": [{
      "summary": "Effectively delivers individual tasks",
      "signals": [
        "Estimates small tasks accurately",
        "Delivers tightly-scoped projects efficiently",
        "Writes effective technical specs outlining approach",
      ],
      "examples": [
        "Wrote the technical spec for featured post images",
        "Delivered stream item support for email digests",
        "Delivered payment history dashboard",
      ],
    }, {
      "summary": "Effectively delivers small personal projects",
      "signals": [
        "Performs research and considers alternative approaches",
        "Balances pragmatism and polish appropriately",
        "Defines and hits interim milestones",
      ],
      "examples": [
        "Delivered promo editor",
        "Delivered audio uploading for web client",
        "Executed the recommends to claps backfill",
      ],
    }, {
      "summary": "Effectively delivers projects through a small team",
      "signals": [
        "Delegates tasks to others appropriately",
        "Integrates business needs into project planning",
        "Chooses appropriate project management strategy based on context",
      ],
      "examples": [
        "Ran project retro to assess improvement opportunities",
        "Completed launch checklist unprompted for well controlled rollout",
        "Facilitated project kickoff meeting to get buy-in",
      ],
    }, {
      "summary": "Effectively delivers projects through a large team, or with a significant amount of stakeholders or complexity",
      "signals": [
        "Finds ways to deliver requested scope faster, and prioritizes backlog",
        "Manages dependencies on other projects and teams",
        "Leverages recognition of repeated project patterns",
      ],
      "examples": [
        "Oversaw technical delivery of Hightower",
        "Managed infrastructure migration to VPC",
        "Involved marketing, legal, and appropriate functions at project start",
      ],
    }, {
      "summary": "Manages major company pushes delivered by multiple teams",
      "signals": [
        "Considers external constraints and business objectives when planning",
        "Leads teams of teams, and coordinates effective cross-functional collaboration",
        "Owns a key company metric",
      ],
      "examples": [
        "Managed technical migration to SOA",
        "Lead technical delivery of 10/7",
        "Delivered multi-month engineering project on time",
      ],
    }],
  },

  "COMMUNICATION": {
    "displayName": "Communication",
    "category": "B",
    "description": "Shares the right amount of information with the right people, at the right time, and listens effectively",
    "milestones": [{
      "summary": "Communicates effectively to close stakeholders when called upon, and incorporates constructive feedback",
      "signals": [
        "Communicates project status clearly and effectively",
        "Collaborates with others with empathy",
        "Asks for help at the appropriate juncture",
      ],
      "examples": [
        "Updated The Watch before running a backfill",
        "Updated project status changes in Asana promptly",
        "Gave thoughtful check-in and check-out comments",
      ],
    }, {
      "summary": "Communicates with the wider team appropriately, focusing on timeliness and good quality conversations",
      "signals": [
        "Practises active listening and suspension of attention",
        "Ensures stakeholders are aware of current blockers",
        "Chooses the appropriate tools for accurate and timely communication",
      ],
      "examples": [
        "Received and integrated critical feedback positively",
        "Created cross-team Slack channel for payments work",
        "Spoke to domain experts before writing spec",
      ],
    }, {
      "summary": "Proactively shares information, actively solicits feedback, and facilitates communication for multiple stakeholders",
      "signals": [
        "Resolves communication difficulties between others",
        "Anticipates and shares schedule deviations in plenty of time",
        "Manages project stakeholder expectations effectively",
      ],
      "examples": [
        "Directed team response effectively during outages",
        "Gave a substantial Eng All Hands presentation on React",
        "Gave notice of upcoming related work in Eng Briefing",
      ],
    }, {
      "summary": "Communicates complex ideas skillfully and with nuance, and establishes alignment within the wider organization",
      "signals": [
        "Communicates project risk and tradeoffs skillfully and with nuance",
        "Contextualizes and clarifies ambiguous direction and strategy for others",
        "Negotiates resourcing compromises with other teams",
      ],
      "examples": [
        "Lead off-site workshop on interviewing",
        "Wrote Medium's growth framework and rationale",
        "Aligned the entire organization around claps",
      ],
    }, {
      "summary": "Influences outcomes at the highest level, moves beyond mere broadcasting, and sets best practices for others",
      "signals": [
        "Defines processes for clear communication for the entire team",
        "Shares the right amount of information with the right people, at the right time",
        "Develops and delivers plans to execs, the board, and outside investors",
      ],
      "examples": [
        "Organized half year check-in company offsite",
        "Created the communication plan for a large organizational change",
        "Presented to the board about key company metrics and projects",
      ],
    }],
  },

  "CRAFT": {
    "displayName": "Craft",
    "category": "B",
    "description": "Embodies and promotes practices to ensure excellent quality products and services",
    "milestones": [{
      "summary": "Delivers consistently good quality work",
      "signals": [
        "Tests new code thoroughly, both locally, and in production once shipped",
        "Writes tests for every new feature and bug fix",
        "Writes clear comments and documentation",
      ],
      "examples": [
        "Caught a bug on Hatch before it went live",
        "Landed non-trivial PR with no caretaker comments",
        "Wrote hermetic tests for the happy and sad cases",
      ],
    }, {
      "summary": "Increases the robustness and reliability of codebases, and devotes time to polishing products and systems",
      "signals": [
        "Refactors existing code to make it more testable",
        "Adds tests for uncovered areas",
        "Deletes unnecessary code and deprecates proactively when safe to do so",
      ],
      "examples": [
        "Requested tests for a PR when acting as reviewer",
        "Reduced the number of zelda fitzgerald exceptions",
        "Fixed a TODO for someone else in the codebase",
      ],
    }, {
      "summary": "Improves others' ability to deliver great quality work",
      "signals": [
        "Implements systems that enable better testing",
        "Gives thoughtful code reviews as a domain expert",
        "Adds tooling to improve code quality",
      ],
      "examples": [
        "Improved PRB to run the same volume of tests faster",
        "Simplified hermetic test data modification",
        "Created fixture system for visual quality",
      ],
    }, {
      "summary": "Advocates for and models great quality with proactive actions, and tackles difficult and subtle system issues",
      "signals": [
        "Builds systems so as to eliminate entire classes of programmer error",
        "Focuses the team on quality with regular reminders",
        "Coordinates Watch priorities and projects",
      ],
      "examples": [
        "Added code coverage reporting to iOS CI pipeline",
        "Iterated repeatedly to develop Medium's underlines solution",
        "Defined and oversaw plan for closing Heartbleed vulnerability",
      ],
    }, {
      "summary": "Enables and encourages the entire organization to make quality a central part of the development process",
      "signals": [
        "Defines policies for the engineering org that encourage quality work",
        "Identifies and eliminates single points of failure throughout the organization",
        "Secures time and resources from execs to support great quality",
      ],
      "examples": [
        "Negotiated resources for Fix-It week with exec team",
        "Instituted and ensured success of a 20% time policy",
        "Started The Watch",
      ],
    }],
  },

  "INITIATIVE": {
    "displayName": "Initiative",
    "category": "B",
    "description": "Challenges the status quo and effects positive organizational change outside of mandated work",
    "milestones": [{
      "summary": "Identifies opportunities for organizational change or product improvements",
      "signals": [
        "Writes Hatch posts about improvement opportunities",
        "Raises meaningful tensions in tactical meetings",
        "Asks leadership team probing questions at FAM",
      ],
      "examples": [
        "Wrote about problems with TTR on Hatch",
        "Wrote about content policy problems on Hatch",
        "Reported a site issue in Github",
      ],
    }, {
      "summary": "Causes change to positively impact a few individuals or minor improvement to an existing product or service",
      "signals": [
        "Picks bugs off the backlog proactively when blocked elsewhere",
        "Makes design quality improvements unprompted",
        "Takes on trust and safety tasks proactively when blocked elsewhere",
      ],
      "examples": [
        "Advocated on own behalf for a change in role",
        "Implemented flow typing for promises",
        "Audited web client performance in Chrome and proposed fixes",
      ],
    }, {
      "summary": "Causes change to positively impact an entire team or instigates a minor feature or service",
      "signals": [
        "Demonstrates concepts proactively with prototypes",
        "Fixes complicated bugs outside of regular domain",
        "Takes ownership of systems that nobody owns or wants",
      ],
      "examples": [
        "Defined style guide to resolve style arguments",
        "Proposed and implemented at-mentions prototype",
        "Implemented video for Android independently, unprompted",
      ],
    }, {
      "summary": "Effects change that has a substantial positive impact on the engineering organization or a major product impact",
      "signals": [
        "Champions and pioneers new technologies to solve new classes of problem",
        "Exemplifies grit and determination in the face of persistent obstacles",
        "Instigates major new features, services, or architectures",
      ],
      "examples": [
        "Created the interviewing rubric and booklet",
        "Implemented and secured support for native login",
        "Migrated medium2 to mono repo and bazel",
      ],
    }, {
      "summary": "Effects change that has a substantial positive impact on the whole company",
      "signals": [
        "Creates a new function to solve systemic issues",
        "Galvanizes the entire company and garners buy in for a new strategy",
        "Changes complex organizational processes",
      ],
      "examples": [
        "Migrated the organization from Holacracy",
        "Built Medium Android prototype and convinced execs to fund it",
        "Convinced leadership and engineering org to move to Medium Lite architecture",
      ],
    }],
  },

  "CAREER_DEVELOPMENT": {
    "displayName": "Career development",
    "category": "C",
    "description": "Provides strategic support to engineers to help them build the career they want",
    "milestones": [{
      "summary": "Gives insight into opportunities and helps identify individuals' strengths and weaknesses",
      "signals": [
        "Advocates on behalf and in defense of a group member",
        "Shares opportunities for improvements and recognises achievements",
        "Explains appropriate available industry paths",
      ],
      "examples": [
        "Collected and delivered feedback",
        "Discussed career options and areas of interest informally",
        "Hosted a Floodgate Academy intern",
      ],
    }, {
      "summary": "Formally supports and advocates for one person and provides tools to help them solve career problems",
      "signals": [
        "Ensure a group member has an appropriate role on their team",
        "Offers effective career advice to group members, without being prescriptive",
        "Creates space for people to talk through challenges",
      ],
      "examples": [
        "Set up and attended regular, constructive 1:1s",
        "Provided coaching on how to have difficult conversations",
        "Taught group members the GROW model",
      ],
    }, {
      "summary": "Inspires and retains a small group of people and actively pushes them to stretch themselves",
      "signals": [
        "Discusses paths, and creates plans for personal and professional growth",
        "Advocates to align people with appropriate roles within organization",
        "Works with team leads to elevate emerging leaders",
      ],
      "examples": [
        "Reviewed individual group member progression every 6 weeks",
        "Suggested appropriate group member for Tech Lead position",
        "Arranged a requested switch of discipline for a group member",
      ],
    }, {
      "summary": "Manages interactions and processes between groups, promoting best practices and setting a positive example",
      "signals": [
        "Manages team transitions smoothly, respecting team and individual needs",
        "Develops best practices for conflict resolution",
        "Ensures all group members' roles are meeting their career needs",
      ],
      "examples": [
        "Completed training on situational leadership",
        "Built a resourcing plan based on company, team, and individual goals",
        "Prevented regretted attrition with intentional, targeted intervention",
      ],
    }, {
      "summary": "Supports the development of a signficant part of the engineering org, and widely viewed as a trusted advisor",
      "signals": [
        "Supports and develops senior leaders",
        "Identified leadership training opportunities for senior leadership",
        "Pushes everyone to be as good as they can be, with empathy",
      ],
      "examples": [
        "Provided coaching to group leads",
        "Devised Pathwise curriculum for group leads",
        "Advocated to execs for engineer development resources and programs",
      ],
    }],
  },

  "ORG_DESIGN": {
    "displayName": "Org design",
    "category": "C",
    "description": "Defines processes and structures that enables the strong growth and execution of a diverse eng organization",
    "milestones": [{
      "summary": "Respects and participates in processes, giving meaningful feedback to help the organization improve",
      "signals": [
        "Reflects on meetings that leave them inspired or frustrated",
        "Teaches others about existing processes",
        "Actively participates and makes contributions within organizational processes",
      ],
      "examples": [
        "Facilitated effective tactical meeting with empathy",
        "Explained tactical meeting format to a new hire",
        "Provided feedback on sprint planning meeting",
      ],
    }, {
      "summary": "Identifies opportunities to improve existing processes and makes changes that positively affect the local team",
      "signals": [
        "Defines meeting structure and cadence that meets team needs",
        "Engages in organizational systems thinking",
        "Advocates for improved diversity and inclusion, and proposes ideas to help",
      ],
      "examples": [
        "Defined Frankenmeeting structure for small team",
        "Improved Watch on-call rotation scheduling",
        "Defined standard channels for inter-team communication",
      ],
    }, {
      "summary": "Develops processes to solve ongoing organizational problems",
      "signals": [
        "Creates programs that meaningfully improve organizational diversity",
        "Solves long-standing organizational problems",
        "Reallocates resources to meet organizational needs",
      ],
      "examples": [
        "Developed baseline team templates for consistency",
        "Created bug-rotation program to address ongoing quality issues",
        "Defined Guilds manifesto and charter",
      ],
    }, {
      "summary": "Thinks deeply about organizational issues and identifies hidden dynamics that contribute to them",
      "signals": [
        "Evaluates incentive structures and their effect on execution",
        "Analyzes existing processes for bias and shortfall",
        "Ties abstract concerns to concrete organizational actions or norms",
      ],
      "examples": [
        "Connected mobile recruiting difficulties to focus on excellence",
        "Raised leadership level change discrepancies",
        "Analyzed the hiring rubric for false negative potential",
      ],
    }, {
      "summary": "Leads initiatives to address issues stemming from hidden dynamics and company norms",
      "signals": [
        "Builds programs to train leadership in desired skills",
        "Creates new structures that provide unique growth opportunities",
        "Leads planning and communication for reorgs",
      ],
      "examples": [
        "Lead efforts to increase number of mobile engineers",
        "Directed resources to meaningfully improve diversity at all levels",
        "Built the growth framework rubric",
      ],
    }],
  },

  "WELLBEING": {
    "displayName": "Wellbeing",
    "category": "C",
    "description": "Supports the emotional well-being of group members in difficult times, and celebrates their successes",
    "milestones": [{
      "summary": "Uses tools and processes to help ensure colleagues are healthy and happy",
      "signals": [
        "Keeps confidences unless legally or morally obliged to do otherwise",
        "Applies the reasonable person principle to others",
        "Avoids blame and focuses on positive change",
      ],
      "examples": [
        "Ensured group members were taking enough vacation",
        "Put themself in another's shoes to understand their perspective",
        "Checked in with colleague showing signs of burnout",
      ],
    }, {
      "summary": "Creates a positive, supportive, engaging team environment for group members",
      "signals": [
        "Sheds light on other experiences to build empathy and compassion",
        "Validates ongoing work and sustains motivation",
        "Proposes solutions when teams get bogged down or lose momentum",
      ],
      "examples": [
        "Coordinated a small celebration for a project launch",
        "Connected tedious A|B testing project with overall company goals",
        "Noted a team without a recent win and suggested some easy quick wins",
      ],
    }, {
      "summary": "Manages expectations across peers, leads in the org, promotes calm, and prevents consensus building",
      "signals": [
        "Trains group members to separate stimulus from response",
        "Maintains a pulse on individual and team morale",
        "Helps group members approach problems with curiosity",
      ],
      "examples": [
        "Completed training on transference and counter transference",
        "Completed training on compromise and negotiation techniques",
        "Reframed a problem as a challenge, instead of a barrier, when appropriate",
      ],
    }, {
      "summary": "Advocates for the needs of teams and group members, and proactively works to calm the organization",
      "signals": [
        "Ensures team environments are safe and inclusive, proactively",
        "Grounds group member anxieties in reality",
        "Tracks team retention actively and proposes solutions to strengthen it",
      ],
      "examples": [
        "Relieved org tension around product direction by providing extra context",
        "Encouraged group members to focus on what they can control",
        "Guided people through complex organizational change",
      ],
    }, {
      "summary": "Manages narratives, channels negativity into inspiration and motivation, and protects the entire team",
      "signals": [
        "Recognizes and points out narratives when appropriate",
        "Works to reshape narratives from victimization to ownership",
        "Increases the psychological safety of the entire team",
      ],
      "examples": [
        "Converted group member from a problem haver to a problem solver",
        "Challenged false narrative and redirected to compassion and empathy",
        "Cultivated and championed a culture of empathy within the entire team",
      ],
    }],
  },

  "ACCOMPLISHMENT": {
    "displayName": "Accomplishment",
    "category": "C",
    "description": "Inspires day to day excellence, maximises potential and effectively resolves performance issues with compassion",
    "milestones": [{
      "summary": "Helps individuals identify blockers and helps them identify next steps for resolution",
      "signals": [
        "Notices when someone is stuck and reaches out",
        "Helps others break down problems into feasible, tangible next steps",
        "Talks through problems non-judgmentally",
      ],
      "examples": [
        "Completed training on diagnosing problems",
        "Unblocked a group member",
        "Reinforces and affirms positive feedback for good work",
      ],
    }, {
      "summary": "Helps individuals resolve difficult performance issues, with insight, compassion, and skill",
      "signals": [
        "Gathers context outside the immediate problem",
        "Recognizes issues within local environment and suggests change",
        "Works to encourage ownership of actions and responsibilities",
      ],
      "examples": [
        "Completed training on decision making",
        "Convinced a group member to solve a problem directly, rather than doing it for them",
        "Gave honest feedback about poor performance, with compassion",
      ],
    }, {
      "summary": "Intervenes in long-standing performance issues with targeted behavior change or performance plans",
      "signals": [
        "Aggregates signals of poor performance and creates process for improvement",
        "Investigates motivation and externalities for consistent poor performance",
        "Puts together comprehensive, achievable performance plans",
      ],
      "examples": [
        "Worked with group member to address persistent communication failures",
        "Arranged a transfer to another team, resulting in improved performance",
        "Managed group member closely to maximise chances of PIP success",
      ],
    }, {
      "summary": "Mediates escalated situations, empowers underperforming teams, and resolves conflict",
      "signals": [
        "Recognizes heightened situations and toxic or aggressive interactions",
        "Inserts themself into conflict where appropriate to calm and mediate",
        "Encourages open dialog and builds trust between parties in conflict",
      ],
      "examples": [
        "Empowered a team to drive forward amidst uncertainty",
        "Protected team from externalities so they could focus on goals",
        "Mediated sit-down between team members to address tension",
      ],
    }, {
      "summary": "Resolves complex organizational dysfunction, or persistent conflict at senior levels",
      "signals": [
        "Takes control of dysfunctional teams to organise chaos",
        "Repairs broken team dynamics and builds harmony",
        "Presides over a well-oiled team of teams",
      ],
      "examples": [
        "Turned around the performance of a problematic team",
        "De-escalated serious tensions between teams",
        "Rebuilt trust between senior team leads",
      ],
    }],
  },

  "MENTORSHIP": {
    "displayName": "Mentorship",
    "category": "D",
    "description": "Provides support to colleagues, spreads knowledge, and develops the team outside formal reporting structures",
    "milestones": [{
      "summary": "Informally mentors individuals in an ad-hoc way, supports new hires, and conveys institutional knowledge",
      "signals": [
        "Makes themself available for informal support and advice",
        "Acts as sounding board for peers and more junior members",
        "Provides sound advice when asked",
      ],
      "examples": [
        "Acted as an onboarding buddy",
        "Paired with an engineer to help them with an unfamiliar area",
        "Helped a colleague understand their feelings",
      ],
    }, {
      "summary": "Mentors people proactively, and guides people to realizations rather than providing the answer",
      "signals": [
        "Takes time to explain concepts and best practices",
        "Asks questions to illuminate concepts, rather than stating them",
        "Allows others to lead efforts when it will help their development",
      ],
      "examples": [
        "Shared interesting article with a team member to help with their growth",
        "Offered unprompted feedback to help growth, with empathy",
        "Lead from behind to support someone new to a leadership role",
      ],
    }, {
      "summary": "Teaches small groups of engineers and contributes to Medium's shared knowledge base",
      "signals": [
        "Avoids siloing information when it can be usefully shared with others",
        "Works to increase the bus factor of systems",
        "Finds tools that work best for a team member's personality",
      ],
      "examples": [
        "Gave a brown bag presentation on payments",
        "Wrote Hatch post on avoiding RDS backfill issues",
        "Wrote Medium-U content module",
      ],
    }, {
      "summary": "Encourages people to mentor each other, and creates ways for them to do so",
      "signals": [
        "Defines an entire curriculum for a discipline",
        "Draws positive attention to well-modeled mentor and teaching behaviours",
        "Creates brown bag series and lines up speakers",
      ],
      "examples": [
        "Created and lead Medium's Women in Eng group",
        "Organized an Eng All Hands with an outside speaker",
        "Designed and taught web client guild curriculum",
      ],
    }, {
      "summary": "Instills and promotes a culture of learning and development within the team",
      "signals": [
        "Sets incentive structures to recognise and reward mentorship",
        "Empowers team members to develop themselves",
        "Role models productive and healthy mentor relationships",
      ],
      "examples": [
        "Instituted the professional education budget for engineers",
        "Mentored mentors",
        "Started the eng advisor program and lined up external mentors",
      ],
    }],
  },

  "EVANGELISM": {
    "displayName": "Evangelism",
    "category": "D",
    "description": "Promotes Medium to the outside world and establishes it as an attractive and thoughtful place to work",
    "milestones": [{
      "summary": "Represents Medium well externally, and influences individuals positively",
      "signals": [
        "Shares personal and organizational successes with their network",
        "Attends Medium-hosted events and talks with guests",
        "Communicates genuine and honest excitement about their work externally",
      ],
      "examples": [
        "Shared a Medium product launch post on Facebook",
        "Acted as a guide for a non-friend visitor to the office",
        "Supported PR efforts by giving a quote or having a photo taken",
      ],
    }, {
      "summary": "Participates more centrally in small events, and takes simple actions that positively influence groups of people",
      "signals": [
        "Takes meaningful action to introduce people to Medium",
        "Joined public Slack group and represented Medium appropriately, and well",
        "Organizes positive small- or medium-sized events that bring people to Medium",
      ],
      "examples": [
        "Volunteered as a helper for CODE2040 writing workshop",
        "Organized a short tour of the office by college students",
        "Talked at a Women Who Code event hosted at Medium",
      ],
    }, {
      "summary": "Works hard to positively influence large groups of people on their views of Medium",
      "signals": [
        "Mentors or participates in a high visibility way in an external organization",
        "Builds fruitful partnerships with external organizations",
        "Writes blog posts about Medium that receive moderate traffic",
      ],
      "examples": [
        "Represented Medium on a panel at a conference of industry experts",
        "Established close ties with Creative Commons",
        "Built a durable, long-standing relationship with Code2040",
      ],
    }, {
      "summary": "Establishes Medium as an great, innovative company and workplace to the whole industry",
      "signals": [
        "Establishes themself as an industry thought leader who attracts talent",
        "Publishes material about Medium's organizational or technical innovations",
        "Leverages significant following to evangelise Medium",
      ],
      "examples": [
        "Published a paper on Medium technology in a peer-reviewed journal",
        "Authored joint-press release with EFF on DNT",
        "Published “Why Content Editable Is Terrible” on the Medium engineering blog",
      ],
    }, {
      "summary": "Introduces Medium in a positive light to a wider audience outside the industry",
      "signals": [
        "Delivers key messages to broad, mainstream audiences",
        "Influences people with large audiences to talk about Medium positively",
        "Drives recognition and adoption of Medium in significant numbers",
      ],
      "examples": [
        "Published or interviewed in a mainstream newspaper or website outside tech",
        "Keynoted a conference with international attention",
        "Represented Medium in national televised media",
      ],
    }],
  },

  "RECRUITING": {
    "displayName": "Recruiting",
    "category": "D",
    "description": "Strengthens Medium's team by bringing in excellent staff members",
    "milestones": [{
      "summary": "Brings new candidates into the pipeline and understands how to evaluate candidates at Medium",
      "signals": [
        "Reviews existing network for hiring leads regularly",
        "Shadows interviews to gain familiarity with process",
        "Reviews current job postings regularly",
      ],
      "examples": [
        "Completed interview calibration",
        "Set up casual sessions to practice asking questions",
        "Referred appropriate individuals for open positions",
      ],
    }, {
      "summary": "Interviews regularly, helps the team make meaningful hiring decisions, and helps build a diverse pipeline",
      "signals": [
        "Uses interview rubric to provide clear, objective feedback on candidates",
        "Interviews candidates with empathy and treats them all with equal respect",
        "Researches approaches for sourcing candidates and diversifying hiring",
      ],
      "examples": [
        "Added observable evidence for every rating",
        "Started a monthly brunch for candidates to meet Medium employees",
        "Tested a new service for quality and diversity of candidates",
      ],
    }, {
      "summary": "Maintains and strengthens the integrity of the current process, and regularly brings in great candidates",
      "signals": [
        "Teaches new interviewers how to interview with empathy",
        "Models great interview technique and feedback when shadowed",
        "Reverse shadows trainees and helps calibrate their feedback",
      ],
      "examples": [
        "Wrote new interview question which meets our question quality criteria",
        "Brought candidates into our pipeline proactively, with a high conversion rate",
        "Proposed useful, tangible improvements to the interview process",
      ],
    }, {
      "summary": "Actively contributes to and leads hiring decisions, and goes to great lengths to source great candidates",
      "signals": [
        "Documents subtle cues in interviews that indicate values alignment",
        "Makes hiring decisions, resolving discrepancies between conflicting reports",
        "Top-grades candidates and teases out character traits",
      ],
      "examples": [
        "Planned engineering summit on interview process and training",
        "Organized and lead Medium's presence at a recruitment fair",
        "Started CODE2040 internship program",
      ],
    }, {
      "summary": "Sets recruitment strategy, invests in long-term relationships for critical roles, and recruits at scale",
      "signals": [
        "Sets the tone, policy and goals around building a diverse, high-quality team",
        "Identifies and brings in promising acquisitions",
        "Tracks industry activity, identifying opportunities for critical roles",
      ],
      "examples": [
        "Talked with a senior candidate over many months to fill a critical role",
        "Organized efforts around convincing acquired engineers to join and stay",
        "Set goals, then tracked and reported metrics on team demographics over time",
      ],
    }],
  },

  "COMMUNITY": {
    "displayName": "Community",
    "category": "D",
    "description": "Builds community internally, gives of themself to the team, and champions and extols company values",
    "milestones": [{
      "summary": "Is available and present on current teams, and works to contribute positively to company culture",
      "signals": [
        "Participates in team activities and offsites",
        "Treats colleagues and clients with respect",
        "Joins groups or committees outside regular duties",
      ],
      "examples": [
        "Joined and actively participated in the web client guild",
        "Brought a small gift back from vacation for the team",
        "Wrote entertaining and informative Prod Ops writeups on Hatch",
      ],
    }, {
      "summary": "Steps up, builds connectedness, and takes concrete actions to promote an inclusive culture",
      "signals": [
        "Makes space for others to participate",
        "Collaborates with other engineers outside direct responsibilities",
        "Finds ways to ramp up and engage new hires quickly",
      ],
      "examples": [
        "Created onboarding bingo",
        "Brought shy and introverted people into a dominant conversation",
        "Volunteered as secretary for a team",
      ],
    }, {
      "summary": "Contributes to improving team relatedness, and helps build a culture of lending support",
      "signals": [
        "Takes on additional Watch shifts at short notice",
        "Pitches in to help other teams hit deadlines, without missing own deadlines",
        "Uses position to raise difficult issues on someone's behalf",
      ],
      "examples": [
        "Lead Watch cycles with little support while still contributing to projects",
        "Started and drove the LGBTQIA ERG",
        "Stayed positive and improved team morale during period after layoffs",
      ],
    }, {
      "summary": "Exemplifies selflessness for the team without compromising responsibilities, and lifts everyone up",
      "signals": [
        "Goes above and beyond on the Watch, serving the team without complaint",
        "Implements concrete programs to signficantly improve team inclusivity",
        "Takes on large amounts of tedious grunt work for the team without being asked",
      ],
      "examples": [
        "Devoted large amount of time to helping outside direct responsibilities",
        "Refactored hundreds of legacy Shepherd nodes",
        "Acted as sole maintainer of Boxen for years",
      ],
    }, {
      "summary": "Lives the company values, guards positive culture, and defines policies that support relatedness between teams",
      "signals": [
        "Brings separate teams together to build relatedness",
        "Holds individuals, teams, and leadership accountable to Medium's values",
        "Sets the tone, policy, and goals around maintaining an inclusive company",
      ],
      "examples": [
        "Organized wine and olive tasting offsite to Napa for the whole engineering org",
        "Devised, delivered and acted on findings from an engineer happiness survey",
        "Challenged and corrected exclusionary behaviour or policies",
      ],
    }],
  },
}

export const cookTracks: CookTracks = {
  "CULINARY_SKILLS": {
    "displayName": "Culinary Skills",
    "category": "A",
    "description": "Develops expertise in cooking techniques, flavor profiles, and culinary creativity",
    "milestones": [{
      "summary": "Works effectively with basic cooking techniques, following recipes and established procedures",
      "signals": [
        "Prepares simple dishes following standard recipes",
        "Uses basic cooking techniques like sautéing, boiling, and grilling",
        "Maintains cleanliness and organization while cooking",
      ],
      "examples": [
        "Successfully prepared daily soup following recipe",
        "Grilled burgers to proper temperature consistently",
        "Prepared basic salads with proper ingredient prep",
      ],
    }, {
      "summary": "Develops proficiency in intermediate techniques and begins to modify existing recipes",
      "signals": [
        "Adapts recipes based on available ingredients",
        "Uses intermediate techniques like braising and roasting",
        "Understands flavor pairing and seasoning principles",
      ],
      "examples": [
        "Modified pasta recipe when out of specific ingredients",
        "Successfully braised short ribs for special dinner",
        "Created daily specials using seasonal ingredients",
      ],
    }, {
      "summary": "Demonstrates advanced culinary skills and creates original recipes",
      "signals": [
        "Develops new recipes that become menu staples",
        "Masters complex techniques like sauce making and pastry",
        "Mentors junior cooks in technique development",
      ],
      "examples": [
        "Created signature sauce that increased customer satisfaction",
        "Developed weekly specials that drove increased sales",
        "Taught new hires advanced knife skills and techniques",
      ],
    }, {
      "summary": "Innovates cuisine and sets culinary direction for the kitchen",
      "signals": [
        "Develops seasonal menus that showcase culinary expertise",
        "Introduces new cooking techniques and equipment",
        "Creates dishes that establish the restaurant's reputation",
      ],
      "examples": [
        "Designed farm-to-table menu that increased restaurant ratings",
        "Implemented sous vide techniques that improved food quality",
        "Created tasting menu that received local food critic praise",
      ],
    }, {
      "summary": "Is recognized as a culinary expert and influences industry trends",
      "signals": [
        "Develops signature cooking style that influences other kitchens",
        "Mentors other head cooks and contributes to culinary education",
        "Creates innovative dishes that set industry standards",
      ],
      "examples": [
        "Published cookbook featuring signature techniques",
        "Judged culinary competitions and mentored upcoming chefs",
        "Pioneered fusion techniques adopted by other restaurants",
      ],
    }],
  },

  "FOOD_SAFETY": {
    "displayName": "Food Safety",
    "category": "A",
    "description": "Ensures safe food handling practices and maintains health standards",
    "milestones": [{
      "summary": "Follows basic food safety protocols and maintains personal hygiene standards",
      "signals": [
        "Consistently washes hands and uses proper sanitation",
        "Maintains proper food storage temperatures",
        "Follows FIFO (first in, first out) rotation principles",
      ],
      "examples": [
        "Properly stored all perishables at correct temperatures",
        "Maintained clean work station throughout shift",
        "Correctly labeled and dated all food items",
      ],
    }, {
      "summary": "Implements comprehensive food safety systems and identifies potential hazards",
      "signals": [
        "Conducts regular temperature checks and maintains logs",
        "Identifies and corrects food safety violations",
        "Trains others in proper food handling procedures",
      ],
      "examples": [
        "Implemented daily temperature logging system",
        "Identified cross-contamination risk and implemented solution",
        "Trained new employees on allergen awareness",
      ],
    }, {
      "summary": "Develops food safety protocols and ensures compliance across the kitchen",
      "signals": [
        "Creates HACCP plans and monitors critical control points",
        "Conducts food safety audits and implements improvements",
        "Manages food safety training programs",
      ],
      "examples": [
        "Developed comprehensive allergen management system",
        "Led kitchen through successful health department inspection",
        "Created food safety training curriculum for all staff",
      ],
    }, {
      "summary": "Establishes food safety culture and manages complex safety programs",
      "signals": [
        "Develops innovative food safety solutions for complex operations",
        "Manages crisis response for food safety incidents",
        "Establishes relationships with health inspectors and regulatory bodies",
      ],
      "examples": [
        "Designed food safety protocols for multi-location operation",
        "Successfully managed food recall incident with zero customer impact",
        "Implemented technology solutions for real-time safety monitoring",
      ],
    }, {
      "summary": "Sets industry standards for food safety and influences regulatory practices",
      "signals": [
        "Contributes to food safety regulations and best practices",
        "Consults for other organizations on food safety implementation",
        "Develops innovative food safety technologies or methods",
      ],
      "examples": [
        "Served on advisory board for local health department",
        "Developed food safety app adopted by multiple restaurants",
        "Published research on food safety practices in industry journals",
      ],
    }],
  },

  "MENU_PLANNING": {
    "displayName": "Menu Planning",
    "category": "A",
    "description": "Plans and designs menus that balance customer appeal, cost effectiveness, and operational efficiency",
    "milestones": [{
      "summary": "Assists with menu planning and understands basic costing principles",
      "signals": [
        "Calculates food costs for individual menu items",
        "Suggests seasonal ingredient substitutions",
        "Helps with portion control and recipe standardization",
      ],
      "examples": [
        "Calculated accurate food costs for new appetizer",
        "Suggested summer vegetables to replace winter items",
        "Standardized recipe portions for consistency",
      ],
    }, {
      "summary": "Plans balanced menus and manages food costs effectively",
      "signals": [
        "Designs daily specials based on available ingredients",
        "Balances menu variety with kitchen capabilities",
        "Monitors food waste and adjusts ordering accordingly",
      ],
      "examples": [
        "Created weekly specials that reduced food waste by 15%",
        "Designed lunch menu that improved kitchen efficiency",
        "Implemented portion control that maintained food costs under 30%",
      ],
    }, {
      "summary": "Develops comprehensive menu strategies and manages complex food operations",
      "signals": [
        "Creates seasonal menus that drive customer traffic",
        "Manages supplier relationships and negotiates pricing",
        "Designs menus that optimize kitchen workflow",
      ],
      "examples": [
        "Developed fall menu that increased revenue by 20%",
        "Negotiated supplier contracts that reduced food costs by 10%",
        "Redesigned menu layout to improve kitchen efficiency",
      ],
    }, {
      "summary": "Creates innovative menu concepts and manages large-scale food operations",
      "signals": [
        "Develops menu concepts that differentiate the restaurant",
        "Manages complex dietary restrictions and allergen considerations",
        "Creates scalable menu systems for multiple locations",
      ],
      "examples": [
        "Developed plant-based menu that attracted new customer base",
        "Created comprehensive allergen-free menu options",
        "Designed standardized menu system for restaurant chain",
      ],
    }, {
      "summary": "Sets industry trends in menu development and influences culinary direction",
      "signals": [
        "Creates menu concepts that influence industry trends",
        "Develops innovative approaches to sustainable menu planning",
        "Mentors other culinary professionals in menu development",
      ],
      "examples": [
        "Pioneered zero-waste menu concept adopted industry-wide",
        "Developed sustainable sourcing practices copied by competitors",
        "Created culinary education program for menu planning",
      ],
    }],
  },

  "KITCHEN_MANAGEMENT": {
    "displayName": "Kitchen Management",
    "category": "A",
    "description": "Manages kitchen operations, staff, and workflow to ensure efficient service",
    "milestones": [{
      "summary": "Effectively manages individual station and supports team operations",
      "signals": [
        "Maintains clean and organized work station",
        "Communicates effectively with team during service",
        "Manages time to meet service deadlines",
      ],
      "examples": [
        "Consistently maintained grill station during busy service",
        "Communicated order status clearly to expediter",
        "Completed prep work on time for evening service",
      ],
    }, {
      "summary": "Coordinates multiple stations and manages kitchen workflow",
      "signals": [
        "Coordinates timing between different kitchen stations",
        "Manages inventory and ordering for the kitchen",
        "Trains new kitchen staff on procedures",
      ],
      "examples": [
        "Synchronized appetizer and entree timing for large parties",
        "Implemented inventory system that reduced waste",
        "Trained three new cooks on kitchen procedures",
      ],
    }, {
      "summary": "Manages complete kitchen operations and leads kitchen team",
      "signals": [
        "Oversees all kitchen stations during service",
        "Manages kitchen staff schedules and performance",
        "Implements systems to improve kitchen efficiency",
      ],
      "examples": [
        "Led kitchen team through record-breaking service night",
        "Implemented cross-training program that improved flexibility",
        "Reduced average ticket time by 20% through workflow improvements",
      ],
    }, {
      "summary": "Manages complex kitchen operations and develops kitchen systems",
      "signals": [
        "Designs kitchen layouts and workflow systems",
        "Manages large kitchen teams across multiple shifts",
        "Implements technology solutions for kitchen management",
      ],
      "examples": [
        "Redesigned kitchen layout that improved efficiency by 30%",
        "Managed kitchen team of 15+ across three shifts",
        "Implemented POS integration that reduced order errors",
      ],
    }, {
      "summary": "Sets standards for kitchen management and influences industry practices",
      "signals": [
        "Develops innovative kitchen management systems",
        "Mentors other kitchen managers and culinary leaders",
        "Creates scalable systems for large culinary operations",
      ],
      "examples": [
        "Developed kitchen management software used by multiple restaurants",
        "Consulted for restaurant group on kitchen operations",
        "Created training program for culinary management certification",
      ],
    }],
  },

  "PROJECT_MANAGEMENT": {
    "displayName": "Project management",
    "category": "B",
    "description": "Delivers well-scoped programs of work that meet their goals, on time, to budget, harmoniously",
    "milestones": [{
      "summary": "Effectively delivers individual tasks",
      "signals": [
        "Estimates small tasks accurately",
        "Delivers tightly-scoped projects efficiently",
        "Writes effective plans outlining approach",
      ],
      "examples": [
        "Planned and executed special dinner menu for holiday event",
        "Delivered catering order for 50 people on time and on budget",
        "Organized kitchen prep schedule for busy weekend",
      ],
    }, {
      "summary": "Effectively delivers small personal projects",
      "signals": [
        "Performs research and considers alternative approaches",
        "Balances pragmatism and polish appropriately",
        "Defines and hits interim milestones",
      ],
      "examples": [
        "Planned and implemented new breakfast menu",
        "Organized kitchen equipment upgrade project",
        "Executed successful wine pairing dinner event",
      ],
    }, {
      "summary": "Effectively delivers projects through a small team",
      "signals": [
        "Delegates tasks to others appropriately",
        "Integrates business needs into project planning",
        "Chooses appropriate project management strategy based on context",
      ],
      "examples": [
        "Led team to implement new POS system in kitchen",
        "Managed kitchen renovation project while maintaining service",
        "Coordinated multi-course tasting menu with service team",
      ],
    }, {
      "summary": "Effectively delivers projects through a large team, or with a significant amount of stakeholders or complexity",
      "signals": [
        "Finds ways to deliver requested scope faster, and prioritizes backlog",
        "Manages dependencies on other projects and teams",
        "Leverages recognition of repeated project patterns",
      ],
      "examples": [
        "Managed kitchen operations during restaurant expansion",
        "Led implementation of new food safety protocols across multiple locations",
        "Coordinated large catering events with multiple vendors",
      ],
    }, {
      "summary": "Manages major company pushes delivered by multiple teams",
      "signals": [
        "Considers external constraints and business objectives when planning",
        "Leads teams of teams, and coordinates effective cross-functional collaboration",
        "Owns a key company metric",
      ],
      "examples": [
        "Led restaurant group's menu standardization project",
        "Managed opening of multiple new restaurant locations",
        "Delivered multi-month kitchen modernization project on time",
      ],
    }],
  },

  "COMMUNICATION": {
    "displayName": "Communication",
    "category": "B",
    "description": "Shares the right amount of information with the right people, at the right time, and listens effectively",
    "milestones": [{
      "summary": "Communicates effectively to close stakeholders when called upon, and incorporates constructive feedback",
      "signals": [
        "Communicates order status clearly and effectively",
        "Collaborates with others with empathy",
        "Asks for help at the appropriate juncture",
      ],
      "examples": [
        "Updated service team about special dietary modifications",
        "Communicated kitchen delays to front of house promptly",
        "Asked for assistance during unexpected rush period",
      ],
    }, {
      "summary": "Communicates with the wider team appropriately, focusing on timeliness and good quality conversations",
      "signals": [
        "Practises active listening and suspension of attention",
        "Ensures stakeholders are aware of current blockers",
        "Chooses the appropriate tools for accurate and timely communication",
      ],
      "examples": [
        "Received and integrated feedback from service staff positively",
        "Created clear communication system for special orders",
        "Consulted with suppliers before making menu changes",
      ],
    }, {
      "summary": "Proactively shares information, actively solicits feedback, and facilitates communication for multiple stakeholders",
      "signals": [
        "Resolves communication difficulties between others",
        "Anticipates and shares schedule deviations in plenty of time",
        "Manages project stakeholder expectations effectively",
      ],
      "examples": [
        "Mediated conflict between kitchen and service staff effectively",
        "Presented new menu items to management team",
        "Gave notice of upcoming equipment maintenance to all staff",
      ],
    }, {
      "summary": "Communicates complex ideas skillfully and with nuance, and establishes alignment within the wider organization",
      "signals": [
        "Communicates operational risk and tradeoffs skillfully and with nuance",
        "Contextualizes and clarifies ambiguous direction and strategy for others",
        "Negotiates resourcing compromises with other teams",
      ],
      "examples": [
        "Led staff meeting on new health safety protocols",
        "Presented cost-benefit analysis of menu changes to ownership",
        "Aligned kitchen and service teams around new service standards",
      ],
    }, {
      "summary": "Influences outcomes at the highest level, moves beyond mere broadcasting, and sets best practices for others",
      "signals": [
        "Defines processes for clear communication for the entire team",
        "Shares the right amount of information with the right people, at the right time",
        "Develops and delivers plans to execs and stakeholders",
      ],
      "examples": [
        "Created communication plan for major menu overhaul",
        "Presented to board about kitchen operations and performance",
        "Established communication standards for entire restaurant group",
      ],
    }],
  },

  "CRAFT": engineeringTracks.CRAFT,
  "INITIATIVE": engineeringTracks.INITIATIVE,
  "CAREER_DEVELOPMENT": engineeringTracks.CAREER_DEVELOPMENT,
  "ORG_DESIGN": engineeringTracks.ORG_DESIGN,
  "WELLBEING": engineeringTracks.WELLBEING,
  "ACCOMPLISHMENT": engineeringTracks.ACCOMPLISHMENT,
  "MENTORSHIP": engineeringTracks.MENTORSHIP,
  "EVANGELISM": engineeringTracks.EVANGELISM,
  "RECRUITING": engineeringTracks.RECRUITING,
  "COMMUNITY": engineeringTracks.COMMUNITY
}

export const cleanerTracks: CleanerTracks = {
  "CLEANING_TECHNIQUES": {
    "displayName": "Cleaning Techniques",
    "category": "A",
    "description": "Develops expertise in cleaning methods, equipment operation, and maintaining hygiene standards",
    "milestones": [{
      "summary": "Works effectively with basic cleaning techniques, following established procedures",
      "signals": [
        "Uses cleaning equipment safely and correctly",
        "Follows standard operating procedures for cleaning",
        "Maintains clean and organized supply areas",
      ],
      "examples": [
        "Properly operated vacuum cleaner on different surface types",
        "Used appropriate cleaning chemicals for bathroom sanitization",
        "Organized cleaning cart efficiently for daily rounds",
      ],
    }, {
      "summary": "Develops proficiency in specialized cleaning techniques and equipment",
      "signals": [
        "Adapts cleaning approach based on surface type and contamination",
        "Uses specialized equipment like floor buffers and carpet cleaners",
        "Identifies and addresses different types of stains and damage",
      ],
      "examples": [
        "Successfully removed coffee stains from office carpet",
        "Used floor buffer to restore marble lobby floors",
        "Adapted cleaning schedule for high-traffic areas",
      ],
    }, {
      "summary": "Masters advanced cleaning techniques and trains others",
      "signals": [
        "Develops efficient cleaning workflows that save time",
        "Troubleshoots equipment problems and performs maintenance",
        "Trains new cleaning staff on proper techniques",
      ],
      "examples": [
        "Created cleaning workflow that reduced time by 20%",
        "Diagnosed and fixed buffer machine belt issue",
        "Trained five new cleaners on infection control procedures",
      ],
    }, {
      "summary": "Innovates cleaning processes and manages complex cleaning operations",
      "signals": [
        "Implements new cleaning technologies and methods",
        "Designs cleaning protocols for specialized environments",
        "Manages cleaning operations for large facilities",
      ],
      "examples": [
        "Implemented UV sanitization system for healthcare facility",
        "Developed cleanroom protocols for laboratory space",
        "Managed cleaning operations for 500,000 sq ft facility",
      ],
    }, {
      "summary": "Sets industry standards and influences cleaning practices",
      "signals": [
        "Develops innovative cleaning technologies or methods",
        "Contributes to industry standards and best practices",
        "Mentors cleaning professionals and contributes to education",
      ],
      "examples": [
        "Developed eco-friendly cleaning product line",
        "Served on committee for industry cleaning standards",
        "Created certification program for professional cleaners",
      ],
    }],
  },

  "EQUIPMENT_MAINTENANCE": {
    "displayName": "Equipment Maintenance",
    "category": "A",
    "description": "Maintains and repairs cleaning equipment to ensure optimal performance",
    "milestones": [{
      "summary": "Performs basic equipment maintenance and identifies issues",
      "signals": [
        "Conducts daily equipment inspections",
        "Performs routine maintenance like filter changes",
        "Reports equipment problems promptly",
      ],
      "examples": [
        "Changed vacuum filters according to schedule",
        "Identified frayed cord on floor buffer before use",
        "Maintained cleaning supply inventory accurately",
      ],
    }, {
      "summary": "Troubleshoots equipment problems and performs repairs",
      "signals": [
        "Diagnoses common equipment malfunctions",
        "Performs minor repairs and part replacements",
        "Maintains equipment service records",
      ],
      "examples": [
        "Replaced worn belts on carpet cleaning machine",
        "Fixed clogged hose on industrial vacuum",
        "Maintained detailed service log for all equipment",
      ],
    }, {
      "summary": "Manages equipment lifecycle and procurement",
      "signals": [
        "Evaluates equipment performance and recommends replacements",
        "Researches new equipment options and technologies",
        "Manages equipment budgets and purchasing decisions",
      ],
      "examples": [
        "Recommended replacement of aging floor scrubber",
        "Evaluated robotic vacuum options for overnight cleaning",
        "Managed $50K annual equipment budget effectively",
      ],
    }, {
      "summary": "Designs equipment systems and manages large equipment programs",
      "signals": [
        "Designs equipment specifications for large facilities",
        "Manages vendor relationships and service contracts",
        "Implements predictive maintenance programs",
      ],
      "examples": [
        "Specified equipment package for new office building",
        "Negotiated service contracts saving 25% annually",
        "Implemented IoT monitoring for equipment performance",
      ],
    }, {
      "summary": "Innovates equipment solutions and influences industry practices",
      "signals": [
        "Develops custom equipment solutions for unique needs",
        "Contributes to equipment design and development",
        "Shares expertise through industry publications and conferences",
      ],
      "examples": [
        "Designed custom cleaning robot for hospital environment",
        "Consulted with manufacturer on equipment improvements",
        "Published research on equipment efficiency optimization",
      ],
    }],
  },

  "SAFETY_PROTOCOLS": {
    "displayName": "Safety Protocols",
    "category": "A",
    "description": "Ensures safe working practices and maintains health and safety standards",
    "milestones": [{
      "summary": "Follows basic safety protocols and uses personal protective equipment",
      "signals": [
        "Consistently uses appropriate PPE",
        "Follows lockout/tagout procedures",
        "Reports safety hazards promptly",
      ],
      "examples": [
        "Wore proper gloves when handling cleaning chemicals",
        "Placed wet floor signs in all appropriate areas",
        "Reported broken handrail to maintenance immediately",
      ],
    }, {
      "summary": "Implements comprehensive safety systems and trains others",
      "signals": [
        "Conducts safety training for new employees",
        "Performs regular safety audits and inspections",
        "Maintains safety documentation and records",
      ],
      "examples": [
        "Trained team on chemical safety and SDS procedures",
        "Conducted monthly safety walks with supervisor",
        "Maintained accurate injury and incident logs",
      ],
    }, {
      "summary": "Develops safety programs and ensures regulatory compliance",
      "signals": [
        "Creates safety protocols for new work environments",
        "Ensures compliance with OSHA and local regulations",
        "Manages safety incident investigations",
      ],
      "examples": [
        "Developed COVID-19 safety protocols for office cleaning",
        "Led successful OSHA inspection with zero violations",
        "Investigated slip and fall incident and implemented improvements",
      ],
    }, {
      "summary": "Manages complex safety programs and crisis response",
      "signals": [
        "Develops safety programs for high-risk environments",
        "Manages emergency response procedures",
        "Coordinates with regulatory agencies",
      ],
      "examples": [
        "Created safety program for hospital infectious disease areas",
        "Managed response to chemical spill incident",
        "Coordinated with health department during norovirus outbreak",
      ],
    }, {
      "summary": "Sets safety standards and influences regulatory practices",
      "signals": [
        "Contributes to safety regulations and industry standards",
        "Develops innovative safety solutions",
        "Mentors safety professionals across organizations",
      ],
      "examples": [
        "Served on advisory committee for cleaning safety standards",
        "Developed safety app adopted by multiple cleaning companies",
        "Created safety certification program for industry",
      ],
    }],
  },

  "EFFICIENCY": {
    "displayName": "Efficiency",
    "category": "A",
    "description": "Optimizes cleaning operations for maximum productivity and cost effectiveness",
    "milestones": [{
      "summary": "Works efficiently and meets productivity standards",
      "signals": [
        "Completes assigned areas within time standards",
        "Uses time and motion efficiently",
        "Minimizes waste of supplies and materials",
      ],
      "examples": [
        "Cleaned 20 offices consistently within 4-hour shift",
        "Reduced supply usage by 15% through careful application",
        "Optimized cart setup to reduce walking time",
      ],
    }, {
      "summary": "Improves processes and helps others increase efficiency",
      "signals": [
        "Identifies bottlenecks and suggests improvements",
        "Shares efficiency tips with team members",
        "Adapts to changing priorities and urgent requests",
      ],
      "examples": [
        "Suggested route changes that saved 30 minutes daily",
        "Taught team efficient bathroom cleaning sequence",
        "Quickly pivoted to urgent conference room setup",
      ],
    }, {
      "summary": "Designs efficient workflows and manages team productivity",
      "signals": [
        "Creates cleaning schedules that optimize productivity",
        "Implements quality control systems",
        "Manages team performance and provides feedback",
      ],
      "examples": [
        "Designed rotation schedule that improved coverage",
        "Implemented checklist system that reduced missed items",
        "Improved team efficiency by 25% through better coordination",
      ],
    }, {
      "summary": "Optimizes large-scale operations and implements technology",
      "signals": [
        "Uses data to optimize cleaning operations",
        "Implements technology solutions for efficiency",
        "Manages complex multi-site operations",
      ],
      "examples": [
        "Used sensors to optimize cleaning schedules based on usage",
        "Implemented mobile app for real-time task management",
        "Coordinated cleaning for 10 office buildings efficiently",
      ],
    }, {
      "summary": "Innovates efficiency solutions and sets industry benchmarks",
      "signals": [
        "Develops innovative efficiency methodologies",
        "Creates industry benchmarks and best practices",
        "Consults on operational efficiency for other organizations",
      ],
      "examples": [
        "Developed lean cleaning methodology adopted industry-wide",
        "Created efficiency metrics used as industry standard",
        "Consulted for Fortune 500 companies on cleaning efficiency",
      ],
    }],
  },

  "PROJECT_MANAGEMENT": {
    "displayName": "Project management",
    "category": "B",
    "description": "Delivers well-scoped programs of work that meet their goals, on time, to budget, harmoniously",
    "milestones": [{
      "summary": "Effectively delivers individual tasks",
      "signals": [
        "Estimates cleaning tasks accurately",
        "Completes projects efficiently",
        "Creates effective work plans",
      ],
      "examples": [
        "Planned and executed deep cleaning of executive offices",
        "Completed carpet cleaning project for entire floor on schedule",
        "Organized supplies and schedule for conference room setup",
      ],
    }, {
      "summary": "Effectively delivers small cleaning projects",
      "signals": [
        "Coordinates multiple cleaning activities",
        "Balances quality and efficiency appropriately",
        "Manages project timelines and milestones",
      ],
      "examples": [
        "Managed post-construction cleanup project",
        "Coordinated window cleaning for entire building",
        "Led seasonal deep cleaning initiative",
      ],
    }, {
      "summary": "Effectively delivers projects through a small team",
      "signals": [
        "Delegates tasks to team members appropriately",
        "Integrates client needs into project planning",
        "Manages team coordination and communication",
      ],
      "examples": [
        "Led team through office relocation cleaning project",
        "Managed cleaning during office renovation",
        "Coordinated event cleanup with catering team",
      ],
    }, {
      "summary": "Effectively delivers complex projects with multiple stakeholders",
      "signals": [
        "Manages dependencies between different teams",
        "Coordinates with facility management and contractors",
        "Prioritizes competing demands effectively",
      ],
      "examples": [
        "Managed cleaning during major office construction",
        "Coordinated with IT, security, and maintenance teams",
        "Led cleaning for company-wide event with 1000+ attendees",
      ],
    }, {
      "summary": "Manages major organizational cleaning initiatives",
      "signals": [
        "Leads company-wide cleaning standard improvements",
        "Coordinates multi-site cleaning projects",
        "Manages large budgets and resources",
      ],
      "examples": [
        "Led implementation of green cleaning across all locations",
        "Managed cleaning operations during company merger",
        "Coordinated response to facility emergency situation",
      ],
    }],
  },

  "COMMUNICATION": {
    "displayName": "Communication",
    "category": "B",
    "description": "Shares the right amount of information with the right people, at the right time, and listens effectively",
    "milestones": [{
      "summary": "Communicates effectively with immediate team and incorporates feedback",
      "signals": [
        "Reports cleaning status clearly",
        "Responds to requests and feedback positively",
        "Asks for help when needed",
      ],
      "examples": [
        "Notified supervisor about spill requiring immediate attention",
        "Received feedback about missed areas and improved performance",
        "Asked for assistance with heavy equipment operation",
      ],
    }, {
      "summary": "Communicates effectively with building occupants and broader team",
      "signals": [
        "Explains cleaning schedules and disruptions clearly",
        "Responds to occupant requests professionally",
        "Coordinates with other facility teams",
      ],
      "examples": [
        "Explained temporary office closure for carpet cleaning",
        "Coordinated with security for after-hours deep cleaning",
        "Communicated equipment malfunction to maintenance team",
      ],
    }, {
      "summary": "Facilitates communication between teams and manages stakeholder expectations",
      "signals": [
        "Mediates between cleaning team and building occupants",
        "Provides regular status updates to management",
        "Manages expectations during service disruptions",
      ],
      "examples": [
        "Resolved conflict between cleaning schedule and meeting needs",
        "Presented monthly cleaning performance report to facility manager",
        "Communicated impact of supply shortage to all stakeholders",
      ],
    }, {
      "summary": "Communicates complex operational information and builds alignment",
      "signals": [
        "Explains cleaning operations to non-technical stakeholders",
        "Negotiates cleaning schedules with multiple departments",
        "Presents recommendations to senior management",
      ],
      "examples": [
        "Presented business case for new cleaning equipment to executives",
        "Negotiated cleaning windows with 24/7 operations team",
        "Aligned multiple departments on new cleaning protocols",
      ],
    }, {
      "summary": "Sets communication standards and influences organizational practices",
      "signals": [
        "Establishes communication protocols for cleaning operations",
        "Represents cleaning operations to external stakeholders",
        "Develops communication training for cleaning staff",
      ],
      "examples": [
        "Created communication standards for emergency cleaning response",
        "Represented company at facility management industry conference",
        "Developed customer service training for cleaning team",
      ],
    }],
  },

  "CRAFT": engineeringTracks.CRAFT,
  "INITIATIVE": engineeringTracks.INITIATIVE,
  "CAREER_DEVELOPMENT": engineeringTracks.CAREER_DEVELOPMENT,
  "ORG_DESIGN": engineeringTracks.ORG_DESIGN,
  "WELLBEING": engineeringTracks.WELLBEING,
  "ACCOMPLISHMENT": engineeringTracks.ACCOMPLISHMENT,
  "MENTORSHIP": engineeringTracks.MENTORSHIP,
  "EVANGELISM": engineeringTracks.EVANGELISM,
  "RECRUITING": engineeringTracks.RECRUITING,
  "COMMUNITY": engineeringTracks.COMMUNITY
}

export type Role = {
  id: RoleId
  displayName: string
  tracks: EngineeringTracks | CookTracks | CleanerTracks
  trackIds: TrackId[]
  titles: Array<{label: string, minPoints: number, maxPoints?: number}>
}

export const roles: Record<RoleId, Role> = {
  engineering: {
    id: 'engineering',
    displayName: 'Engineering',
    tracks: engineeringTracks,
    trackIds: Object.keys(engineeringTracks) as EngineeringTrackId[],
    titles: [
      {label: 'Engineer I', minPoints: 0, maxPoints: 16},
      {label: 'Engineer II', minPoints: 17, maxPoints: 35},
      {label: 'Senior Engineer', minPoints: 36, maxPoints: 57},
      {label: 'Group Lead', minPoints: 36, maxPoints: 57},
      {label: 'Staff Engineer', minPoints: 58, maxPoints: 89},
      {label: 'Senior Group Lead', minPoints: 58, maxPoints: 89},
      {label: 'Principal Engineer', minPoints: 90},
      {label: 'Director of Engineering', minPoints: 90}
    ]
  },
  cook: {
    id: 'cook',
    displayName: 'Cook',
    tracks: cookTracks,
    trackIds: Object.keys(cookTracks) as CookTrackId[],
    titles: [
      {label: 'Cook I', minPoints: 0, maxPoints: 16},
      {label: 'Cook II', minPoints: 17, maxPoints: 35},
      {label: 'Senior Cook', minPoints: 36, maxPoints: 57},
      {label: 'Lead Cook', minPoints: 36, maxPoints: 57},
      {label: 'Sous Chef', minPoints: 58, maxPoints: 89},
      {label: 'Senior Lead Cook', minPoints: 58, maxPoints: 89},
      {label: 'Executive Chef', minPoints: 90},
      {label: 'Culinary Director', minPoints: 90}
    ]
  },
  cleaner: {
    id: 'cleaner',
    displayName: 'Cleaner',
    tracks: cleanerTracks,
    trackIds: Object.keys(cleanerTracks) as CleanerTrackId[],
    titles: [
      {label: 'Cleaner I', minPoints: 0, maxPoints: 16},
      {label: 'Cleaner II', minPoints: 17, maxPoints: 35},
      {label: 'Senior Cleaner', minPoints: 36, maxPoints: 57},
      {label: 'Lead Cleaner', minPoints: 36, maxPoints: 57},
      {label: 'Facility Specialist', minPoints: 58, maxPoints: 89},
      {label: 'Senior Lead Cleaner', minPoints: 58, maxPoints: 89},
      {label: 'Facility Manager', minPoints: 90},
      {label: 'Director of Facilities', minPoints: 90}
    ]
  }
}

// Backward compatibility - default to engineering role
export const tracks = engineeringTracks

// Utility functions for role-based access
export const getRoleFromTrackId = (trackId: TrackId): RoleId => {
  if (Object.keys(engineeringTracks).includes(trackId)) return 'engineering'
  if (Object.keys(cookTracks).includes(trackId)) return 'cook'
  if (Object.keys(cleanerTracks).includes(trackId)) return 'cleaner'
  return 'engineering' // default fallback
}

export const getTrackFromAnyRole = (trackId: TrackId): Track => {
  const roleId = getRoleFromTrackId(trackId)
  const roleTracks = roles[roleId].tracks as any
  return roleTracks[trackId]
}

export const getCurrentRoleTracks = (roleId: RoleId) => {
  return roles[roleId].tracks
}

export const trackIds: TrackId[] = Object.keys(tracks) as TrackId[]

export const categoryIds: Set<string> = trackIds.reduce((set, trackId) => {
  set.add(getTrackFromAnyRole(trackId).category)
  return set
}, new Set<string>())

export const categoryPointsFromMilestoneMap = (milestoneMap: MilestoneMap) => {
  let pointsByCategory = new Map()
  trackIds.forEach((trackId) => {
    const milestone = milestoneMap[trackId] || 0
    const categoryId = getTrackFromAnyRole(trackId).category
    let currentPoints = pointsByCategory.get(categoryId) || 0
    pointsByCategory.set(categoryId, currentPoints + milestoneToPoints(milestone))
  })
  return Array.from(categoryIds.values()).map(categoryId => {
    const points = pointsByCategory.get(categoryId)
    return { categoryId, points: pointsByCategory.get(categoryId) || 0 }
  })
}

export const totalPointsFromMilestoneMap = (milestoneMap: MilestoneMap): number =>
  trackIds.map(trackId => milestoneToPoints(milestoneMap[trackId] || 0))
    .reduce((sum, addend) => (sum + addend), 0)

export const titles = [
  {label: 'Engineer I', minPoints: 0, maxPoints: 16},
  {label: 'Engineer II', minPoints: 17, maxPoints: 35},
  {label: 'Senior Engineer', minPoints: 36, maxPoints: 57},
  {label: 'Group Lead', minPoints: 36, maxPoints: 57},
  {label: 'Staff Engineer', minPoints: 58, maxPoints: 89},
  {label: 'Senior Group Lead', minPoints: 58, maxPoints: 89},
  {label: 'Principal Engineer', minPoints: 90},
  {label: 'Director of Engineering', minPoints: 90}
]

export const eligibleTitles = (milestoneMap: MilestoneMap): string[] => {
  const totalPoints = totalPointsFromMilestoneMap(milestoneMap)

  return titles.filter(title => (title.minPoints === undefined || totalPoints >= title.minPoints)
                             && (title.maxPoints === undefined || totalPoints <= title.maxPoints))
    .map(title => title.label)
}
