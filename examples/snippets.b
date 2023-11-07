Also check
* https://esolangs.org/wiki/Brainfuck_constants
* https://esolangs.org/wiki/Brainfuck_algorithms


Draw a single row on the screen

  >++++++[-<.....>]<..>.<

* Uses two memory cells
* The current cell is the color and the next cell must be empty


Wait for a keypress & keyup

  +>+[<,[>-]>[>]<]+[,]<

* Uses three memory cells
* The next two cells must be empty and the current cell can be anything
* The key is stored in the current cell


Wait for a keypress

  +>+[<,[>-]>[>]<]<

* Uses three memory cells
* The next two cells must be empty and the current cell can be anything
* The key is stored in the current cell


Sleep 1 second (approximately)

  +++++++++++[>,,,,,,,,,,,<-]

* Uses two memory cells
* The current cell must be empty
* This uses the input operation so you might need to add >[-]< at the end if you want to avoid players 
* Much times slower at 1kHz or when debug mode is on
