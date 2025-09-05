import { Role, Track, Title, Milestone } from './role'

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
};

export const platformEngineer = new Role({
  name: 'Platform Engineer',
  max_points: 135,
  tracks: [
    new Track({
      id: 'MOBILE',
      displayName: 'Mobile',
      category: 'a',
      description: "Develops expertise in foundational systems, such as deployments, pipelines, databases and machine learning",
      milestones: [
        new Milestone({summary: 'Has a basic understanding of mobile development', signals: [
            'Can set up a basic mobile project',
            'Understands mobile architecture patterns',
            'Can implement simple UI components'
          ]}),
        new Milestone({summary: 'Can build and deploy mobile applications', signals: [
            'Can build and deploy a mobile app to the app store',
            'Understands mobile performance optimization',
            'Can integrate with backend services'
          ]}),
        new Milestone({summary: 'Proficient in mobile development', signals: [
            'Can design and implement complex mobile features',
            'Understands mobile security best practices',
            'Can mentor junior developers in mobile development'
          ]}),
        new Milestone({summary: 'Can build and deploy mobile applications', signals: [
            'Can build and deploy a mobile app to the app store',
            'Understands mobile performance optimization',
            'Can integrate with backend services'
          ]}),
        new Milestone({summary: 'Proficient in mobile development', signals: [
            'Can design and implement complex mobile features',
            'Understands mobile security best practices',
            'Can mentor junior developers in mobile development'
          ]}),
      ]
    }),
        new Track({
      id: 'MOBILER',
      displayName: 'Mobiler',
      category: 'a',
      description: "Develops expertise in foundational systems, such as deployments, pipelines, databases and machine learning",
      milestones: [
        new Milestone({summary: 'Has a basic understanding of mobile development', signals: [
            '2Can set up a basic mobile project',
            '2Understands mobile architecture patterns',
            'Can implement simple UI components'
          ]}),
        new Milestone({summary: 'Can build and deploy mobile applications', signals: [
            'Can build and deploy a mobile app to the app store',
            'Understands mobile performance optimization',
            'Can integrate with backend services'
          ]}),
        new Milestone({summary: 'Proficient in mobile development', signals: [
            'Can design and implement complex mobile features',
            'Understands mobile security best practices',
            'Can mentor junior developers in mobile development'
          ]}),
        new Milestone({summary: 'Can build and deploy mobile applications', signals: [
            'Can build and deploy a mobile app to the app store',
            'Understands mobile performance optimization',
            'Can integrate with backend services'
          ]}),
        new Milestone({summary: 'Proficient in mobile development', signals: [
            'Can design and implement complex mobile features',
            'Understands mobile security best practices',
            'Can mentor junior developers in mobile development'
          ]}),
      ]
    }),
    new Track({
      id: 'WEB_CLIENT',
      displayName: 'Web Client',
      category: 'b',
      description: "Develops expertise in foundational systems, such as deployments, pipelines, databases and machine learning",
      milestones: [
        new Milestone({summary: 'Has a basic understanding of web client development', signals: [
            'Can set up a basic web client project',
            'Understands web architecture patterns',
            'Can implement simple UI components'
          ]}),
        new Milestone({summary: 'Can build and deploy web client applications', signals: [
            'Can build and deploy a web app to production',
            'Understands web performance optimization',
            'Can integrate with backend services'
          ]}),
        new Milestone({summary: 'Proficient in web client development', signals: [
            'Can design and implement complex web features',
            'Understands web security best practices',
            'Can mentor junior developers in web client development'
          ]}),
          new Milestone({summary: 'Can build and deploy mobile applications', signals: [
            'Can build and deploy a mobile app to the app store',
            'Understands mobile performance optimization',
            'Can integrate with backend services'
          ]}),
        new Milestone({summary: 'Proficient in mobile development', signals: [
            'Can design and implement complex mobile features',
            'Understands mobile security best practices',
            'Can mentor junior developers in mobile development'
          ]}),      ]
    }),
    new Track({
      id: 'afasdafda',
      displayName: 'Web Client',
      category: 'c',
      description: "Develops expertise in foundational systems, such as deployments, pipelines, databases and machine learning",
      milestones: [
        new Milestone({summary: 'Has a basic understanding of web client development', signals: [
            'Can set up a basic web client project',
            'Understands web architecture patterns',
            'Can implement simple UI components'
          ]}),
        new Milestone({summary: 'Can build and deploy web client applications', signals: [
            'Can build and deploy a web app to production',
            'Understands web performance optimization',
            'Can integrate with backend services'
          ]}),
        new Milestone({summary: 'Proficient in web client development', signals: [
            'Can design and implement complex web features',
            'Understands web security best practices',
            'Can mentor junior developers in web client development'
          ]}),
          new Milestone({summary: 'Can build and deploy mobile applications', signals: [
            'Can build and deploy a mobile app to the app store',
            'Understands mobile performance optimization',
            'Can integrate with backend services'
          ]}),
        new Milestone({summary: 'Proficient in mobile development', signals: [
            'Can design and implement complex mobile features',
            'Understands mobile security best practices',
            'Can mentor junior developers in mobile development'
          ]}),
      ]
    }),
    new Track({
      id: 'dafdafds',
      displayName: 'Web Client',
      category: 'd',
      description: "Develops expertise in foundational systems, such as deployments, pipelines, databases and machine learning",
      milestones: [
        new Milestone({summary: 'Has a basic understanding of web client development', signals: [
            'Can set up a basic web client project',
            'Understands web architecture patterns',
            'Can implement simple UI components'
          ]}),
        new Milestone({summary: 'Can build and deploy web client applications', signals: [
            'Can build and deploy a web app to production',
            'Understands web performance optimization',
            'Can integrate with backend services'
          ]}),
        new Milestone({summary: 'Proficient in web client development', signals: [
            'Can design and implement complex web features',
            'Understands web security best practices',
            'Can mentor junior developers in web client development'
          ]}),
          new Milestone({summary: 'Can build and deploy mobile applications', signals: [
            'Can build and deploy a mobile app to the app store',
            'Understands mobile performance optimization',
            'Can integrate with backend services'
          ]}),
        new Milestone({summary: 'Proficient in mobile development', signals: [
            'Can design and implement complex mobile features',
            'Understands mobile security best practices',
            'Can mentor junior developers in mobile development'
          ]}),      ]
    })
  ],
  titles: [
    new Title({label: 'Engineer I', minPoints: 0, maxPoints: 16}),
    new Title({label: 'Engineer II', minPoints: 17, maxPoints: 35}),
    new Title({label: 'Senior Engineer', minPoints: 36, maxPoints: 57}),
    new Title({label: 'Group Lead', minPoints: 36, maxPoints: 57}),
    new Title({label: 'Staff Engineer', minPoints: 58, maxPoints: 89}),
    new Title({label: 'Senior Group Lead', minPoints: 58, maxPoints: 89}),
  ]
});
