---
title: 'Markdown Style Test Bench'
author: 'Bilal ☽'
date: '2026-06-21'
category: 'Internal QA'
status: 'Draft'
---

<pre class="ascii-art">
                                                       _--_                                     _--_
                                                     /#()# #\         0             0         /# #()#\
                                                     |()##  \#\_       \           /       _/#/  ##()|
                                                     |#()##-=###\_      \         /      _/###=-##()#|
                                                      \#()#-=##  #\_     \       /     _/#  ##=-#()#/
                                                       |#()#--==### \_    \     /    _/ ###==--#()#|
                                                       |#()##--=#    #\_   \!!!/   _/#    #=--##()#|
                                                        \#()##---===####\   O|O   /####===---##()#/
                                                         |#()#____==#####\ / Y \ /#####==____#()#|
                                                          \###______######|\/#\/|######______###/
                                                             ()#O#/      ##\_#_/##      \#O#()
                                                            ()#O#(__-===###/ _ \###===-__)#O#()
                                                           ()#O#(   #  ###_(_|_)_###  #   )#O#()
                                                           ()#O(---#__###/ (_|_) \###__#---)O#()
                                                           ()#O#( / / ##/  (_|_)  \## \ \ )#O#()
                                                           ()##O#\_/  #/   (_|_)   \#  \_/#O##()
                                                            \)##OO#\ -)    (_|_)    (- /#OO##(/
                                                             )//##OOO*|    / | \    |*OOO##\\
                                                             |/_####_/    ( /X\ )    \_####_\|
                                                            /X/ \__/       \___/       \__/ \X\
                                                           (#/                               \#)
</pre>



<pre class="matrix-box">
                                 ┌───────────────────────────[Summary]───────────────────────────┐
                                 │                                                               │
                                 │  1. Introduction & Objectives                                 │
                                 │  2. Component Inventory Matrix                                │
                                 │  3. Hardware Layout & Wiring Schematics                       │
                                 │  4. Hardware Control Routine                                  │
                                 │                                                               │
                                 └───────────────────────────────────────────────────────────────┘
</pre>




# Heading Level 1

This paragraph exists to test **bold text**, *italic text*, ~~strikethrough text~~, and `inline code`. It also contains a [link to Anthropic](https://www.anthropic.com) to check link color and hover state.

You can also press <kbd>Ctrl</kbd> + <kbd>C</kbd> to copy, and this sentence has a <mark>highlighted phrase</mark> in it.

## Heading Level 2

### Heading Level 3

#### Heading Level 4

##### Heading Level 5

###### Heading Level 6

---

## Lists

Unordered list:

- First item
- Second item
  - Nested item one
  - Nested item two
- Third item

Ordered list:

1. Step one
2. Step two
   1. Sub-step A
   2. Sub-step B
3. Step three

Task list:

- [x] Completed task
- [ ] Pending task
- [ ] Another pending task

## Blockquote

> This is a blockquote. It should render with the gold left border and italic gray text, just like the existing disclaimer notice style on the jammer post.
>
> It can span multiple paragraphs too.

## Table

| Language   | Paradigm             | Year |
| :--------- | :------------------- | :--- |
| Python     | Multi-paradigm       | 1991 |
| JavaScript | Multi-paradigm       | 1995 |
| Rust       | Systems / Functional | 2010 |

## Code Blocks (multi-language highlighting test)

JavaScript:

```js
// Returns the sum of an array
function sum(numbers) {
    let total = 0;
    for (const n of numbers) {
        total += n;
    }
    return total;
}

const label = "Result: ";
console.log(label + sum([1, 2, 3, 4]));
```

Python:

```python
# Simple class definition
class Counter:
    def __init__(self, start=0):
        self.value = start

    def increment(self):
        self.value += 1
        return self.value

c = Counter(10)
print(c.increment())
```

C++:

```cpp
#include <iostream>

int main() {
    int count = 0;
    bool running = true;
    while (running) {
        count++;
        if (count >= 5) {
            running = false;
        }
    }
    std::cout << "Done: " << count << std::endl;
    return 0;
}
```

## Image with Caption

<figure>
  <img src="https://picsum.photos/seed/testbench/800/400|width=1000" alt="Placeholder test image" />
  <figcaption>Figure 1 — a placeholder image used purely for layout testing.</figcaption>
</figure>

## Horizontal Rule Above

That's everything: headings, inline styles, links, lists (including nested and task lists), blockquotes, a table, three languages of code blocks, and a captioned image.


