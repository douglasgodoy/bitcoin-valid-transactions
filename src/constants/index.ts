import { Map } from 'src/utils/types';

export const CUSTOMERS = [
  {
    UserName: 'Wesley Crusher',
    WId: 'mvd6qFeVkqH6MNAS2Y2cLifbdaX5XUkbZJ',
  },
  { UserName: 'Leonard McCoy', WId: 'mmFFG4jqAtw9MoCC88hw5FNfreQWuEHADp' },
  { UserName: 'Jonathan Archer', WId: 'mzzg8fvHXydKs8j9D2a8t7KpSXpGgAnk4n' },
  { UserName: 'Jadzia Dax', WId: '2N1SP7r92ZZJvYKG2oNtzPwYnzw62up7mTo' },
  { UserName: 'Montgomery Scott', WId: 'mutrAf4usv3HKNdpLwVD4ow2oLArL6Rez8' },
  { UserName: 'James T. Kirk', WId: 'miTHhiX3iFhVnAEecLjybxvV5g8mKYTtnM' },
  { UserName: 'Spock', WId: 'mvcyJMiAcSXKAEsQxbW9TYZ369rsMG6rVV' },
] as const;

export const CUSTOMERS_MAP: Map = {
  mvd6qFeVkqH6MNAS2Y2cLifbdaX5XUkbZJ: 'Wesley Crusher',
  mmFFG4jqAtw9MoCC88hw5FNfreQWuEHADp: 'Leonard McCoy',
  mzzg8fvHXydKs8j9D2a8t7KpSXpGgAnk4n: 'Jonathan Archer',
  '2N1SP7r92ZZJvYKG2oNtzPwYnzw62up7mTo': 'Jadzia Dax',
  mutrAf4usv3HKNdpLwVD4ow2oLArL6Rez8: 'Montgomery Scott',
  miTHhiX3iFhVnAEecLjybxvV5g8mKYTtnM: 'James T. Kirk',
  mvcyJMiAcSXKAEsQxbW9TYZ369rsMG6rVV: 'Spock',
} as const;
