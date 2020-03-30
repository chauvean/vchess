-- Re-run this script after variants are added

insert or ignore into Variants (name, description, noProblems) values
  ('Apocalypse', 'The end of the world', true),
  ('Dark', 'In the shadow', true),
  ('Hidden', 'Unidentified pieces', true),
  ('Hiddenqueen', 'Queen disguised as a pawn', true),
  ('Synchrone', 'Play at the same time', true);

insert or ignore into Variants (name, description) values
  ('Alice', 'Both sides of the mirror'),
  ('Allmate1', 'Mate any piece (v1)'),
  ('Allmate2', 'Mate any piece (v2)'),
  ('Antiking1', 'Keep antiking in check (v1)'),
  ('Antiking2', 'Keep antiking in check (v2)'),
  ('Antimatter', 'Dangerous collisions'),
  ('Arena', 'Middle battle'),
  ('Atomic', 'Explosive captures'),
  ('Ball', 'Score a goal'),
  ('Baroque', 'Exotic captures'),
  ('Benedict', 'Change colors'),
  ('Berolina', 'Pawns move diagonally'),
  ('Cannibal', 'Capture powers'),
  ('Capture', 'Mandatory captures'),
  ('Checkered', 'Shared pieces'),
  ('Checkless', 'No-check mode'),
  ('Chess960', 'Standard rules'),
  ('Circular', 'Run forward'),
  ('Colorbound', 'The colorbound clobberers'),
  ('Coregal', 'Two royal pieces'),
  ('Crazyhouse', 'Captures reborn'),
  ('Cylinder', 'Neverending rows'),
  ('Doublearmy', '64 pieces on the board'),
  ('Dynamo', 'Push and pull'),
  ('Eightpieces', 'Each piece is unique'),
  ('Enpassant', 'Capture en passant'),
  ('Extinction', 'Capture all of a kind'),
  ('Grand', 'Big board'),
  ('Grasshopper', 'Long jumps over pieces'),
  ('Horde', 'A pawns cloud'),
  ('Knightmate', 'Mate the knight'),
  ('Knightrelay1', 'Move like a knight (v1)'),
  ('Knightrelay2', 'Move like a knight (v2)'),
  ('Losers', 'Get strong at self-mate'),
  ('Magnetic', 'Laws of attraction'),
  ('Marseille', 'Double moves'),
  ('Monster', 'White move twice'),
  ('Omega', 'A wizard in the corner'),
  ('Orda', 'Mongolian Horde'),
  ('Parachute', 'Landing on the board'),
  ('Perfect', 'Powerful pieces'),
  ('Racingkings', 'Kings cross the 8x8 board'),
  ('Rifle', 'Shoot pieces'),
  ('Recycle', 'Reuse pieces'),
  ('Royalrace', 'Kings cross the 11x11 board'),
  ('Rugby', 'Transform an essay'),
  ('Schess', 'Seirawan-Harper Chess'),
  ('Shatranj', 'Ancient rules'),
  ('Suicide', 'Lose all pieces'),
  ('Suction', 'Attract opposite king'),
  ('Tencubed', 'Four new pieces'),
  ('Threechecks', 'Give three checks'),
  ('Twokings', 'Two kings'),
  ('Upsidedown', 'Board upside down'),
  ('Wildebeest', 'Balanced sliders & leapers'),
  ('Wormhole', 'Squares disappear'),
  ('Zen', 'Reverse captures');
