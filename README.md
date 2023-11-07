# BF-SYS

A [fantasy computer](https://en.wikipedia.org/wiki/Fantasy_video_game_console) that uses brainfuck as its instruction set.

**Check it out at https://brainfuck.zptr.cc/!**

There aren't many [examples](examples) yet (i suck at brainfuck) so contribution would be really appreciated!

# spec

## Screen
BF-SYS has a 32x32 screen that uses 8-bit colors.

## Sound
BF-SYS has a speaker with 32 channels each with different frequency.
The speaker has a 60hz sound timer, which decreases the delay of each channel until they reach zero.
A channel plays sound only if its timer is not zero.

## Input
Input is done with a regular keyboard using keycodes from [here](http://gcctech.org/csc/javascript/javascript_keycodes.htm)

## Memory
There are 4096 bytes of memory, 8192 bytes of ROM and 4096 additional bytes for the 16-bit stack, allowing up to 256-depth nested loops.

## I/O
The input instruction (`,`) stops the execution until the next tick of a fixed 1kHz clock, and sets the current memory cell to the code of the currently pressed key. If no key is pressed, the cell is set to zero. This instruction can also be used as sleep, since it always waits a constant amount of time no matter the speed of the execution.

The output instruction (`.`) increments the output pointer. If the output pointer is divisible by 33, it changes the delay of a sound channel to the value at the current memory cell. Otherwise, it changes a pixel on the screen to the value at the current memory cell.