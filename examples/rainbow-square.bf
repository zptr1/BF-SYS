+[                      loop

each 8th color in the palette is the brightest
except white (7) so we need to increment by 7
first and then increment by one again

>+++++++                increment the color by 7
>++++[>++++++++<-]>[    repeat 32 times
  draw a single row
  ->++++++[-<<<.....>>>]<<<..>.>
]

<<+                     increment the color by 1
<]                      repeat