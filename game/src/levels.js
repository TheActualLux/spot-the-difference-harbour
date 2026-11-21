// Three hand-composed evenings in the same little harbor. Coordinates are in the 720×440
// painting; each hotspot names the tiny detail that differs between the two views.
export const LEVELS = [
  {
    number: '01', name: 'The Blue Hour', place: 'North Quay',
    note: 'A last gull circles above the sleepy harbor.',
    differences: [
      { id: 'gull', label: 'A gull has gone missing', x: 518, y: 100, r: 28 },
      { id: 'flag', label: 'The pennant points the other way', x: 577, y: 132, r: 24 },
      { id: 'lamp', label: 'The lighthouse lamp has changed', x: 105, y: 128, r: 22 },
      { id: 'buoy', label: 'A buoy has appeared', x: 436, y: 282, r: 22 },
      { id: 'crate', label: 'A crate has moved along the quay', x: 287, y: 353, r: 32 },
      { id: 'sail', label: 'The little sail is shorter', x: 355, y: 247, r: 27 },
      { id: 'window', label: 'A cottage window has gone dark', x: 573, y: 184, r: 20 },
      { id: 'reflection', label: 'A line of reflected light has shifted', x: 416, y: 340, r: 28 }
    ],
  },
  {
    number: '02', name: 'Lantern Tide', place: 'Old Ropewalk',
    note: 'The tide is turning beneath the washing line.',
    differences: [
      { id: 'cat', label: 'The quay cat has wandered off', x: 183, y: 335, r: 25 },
      { id: 'moon', label: 'The moon has changed its phase', x: 584, y: 69, r: 26 },
      { id: 'window', label: 'One upstairs window is dark', x: 546, y: 184, r: 18 },
      { id: 'laundry', label: 'A red sock is missing', x: 288, y: 178, r: 20 },
      { id: 'buoy', label: 'The buoy has drifted east', x: 512, y: 283, r: 24 },
      { id: 'smoke', label: 'A wisp of chimney smoke is gone', x: 550, y: 131, r: 25 },
      { id: 'anchor', label: 'A small anchor is missing from the boat', x: 376, y: 281, r: 18 },
      { id: 'wave', label: 'A ripple has changed direction', x: 635, y: 311, r: 29 },
    ],
  },
  {
    number: '03', name: 'Last Light', place: 'Beacon Point',
    note: 'A warm window glows where the sea meets the sky.',
    differences: [
      { id: 'gull', label: 'A gull has joined the flock', x: 340, y: 94, r: 24 },
      { id: 'beacon', label: 'The beacon beam has turned', x: 111, y: 132, r: 25 },
      { id: 'flag', label: 'The harbor flag has changed color', x: 586, y: 132, r: 23 },
      { id: 'window', label: 'A little window is now lit', x: 573, y: 184, r: 20 },
      { id: 'boat', label: 'The boat has lost its oar', x: 392, y: 273, r: 25 },
      { id: 'star', label: 'One star has winked out', x: 473, y: 53, r: 17 },
      { id: 'crate', label: 'The rope coil has shifted', x: 250, y: 354, r: 26 },
      { id: 'reflection', label: 'The beacon reflection is shorter', x: 161, y: 309, r: 28 },
    ],
  },
];
