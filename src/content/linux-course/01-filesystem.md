---
title: "The Linux Filesystem"
author: "Instructor"
date: "2024-01-16"
---


Linux organises everything in a **single tree hierarchy**, starting at the root directory `/`.

## Important directories

| Directory | Purpose                                    |
| --------- | ------------------------------------------ |
| `/`       | Root of the entire filesystem              |
| `/home`   | User home directories (e.g., `/home/user`) |
| `/etc`    | System configuration files                 |
| `/var`    | Variable data like logs, caches            |
| `/tmp`    | Temporary files (cleared on reboot)        |
| `/usr`    | User programs and libraries                |
| `/bin`    | Essential command binaries                 |

## Basic commands

- `pwd` – show current directory  
- `ls` – list files and folders  
- `cd <directory>` – change directory  
- `mkdir <name>` – create a directory  
- `touch <file>` – create an empty file  

```bash
# Example: navigate to /home and list contents
cd /home
ls -la