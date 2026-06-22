---
title: 'Samsung S6 Edge NetHunter HID Conversion'
author: 'Bilal ☽'
date: '2026-06-22'
category: 'HID Attacks'
status: 'In Progress'
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
                                  │  1. Prerequisites & Disclaimers                               │
                                  │  2. Phase 1: Recovery Installation (Heimdall)                 │
                                  │  3. Phase 2: Clean & LineageOS Deployment                     │
                                  │  4. Phase 3: NetHunter Chroot Setup                           │
                                  │  5. Phase 4: USB HID Kernel Enforcement                       │
                                  │  6. Phase 5: DuckHunter USB Exploits                          │
                                  │                                                               │
                                  └───────────────────────────────────────────────────────────────┘
</pre>


This guide outlines the complete process to convert a Samsung Galaxy S6 Edge into a Kali NetHunter penetration testing device with full USB HID (Rubber Ducky) injection capabilities.

---

### ⚠️ Prerequisites & Disclaimers

*   **Back Up Data**: This process wipes your device completely.
*   **Battery**: Ensure your device is charged to at least 80%.
*   **Correct Model**: Verify your exact S6 Edge model number (e.g., SM-G925F). Flash only compatible files.
*   **Disclaimer**: Rooting and flashing custom firmware void warranties and carry a risk of bricking your device. Proceed at your own risk.

---

### Phase 1: Bootloader Unlocking & TWRP Recovery

### Step 1: Prepare the Phone

1.  Go to **Settings > About Phone > Software Information**.
2.  Tap **Build Number** 7 times to unlock Developer Options.
3.  Go back to **Settings > Developer Options**.
4.  Enable **USB Debugging** and **OEM Unlocking** (if available for your specific variant).

> The Samsung Galaxy S6 Edge (SM-G925F) does not have an "OEM Unlocking" toggle because international Exynos models from that era come with the bootloader unlocked by default.

### Step 2: Boot into Download Mode

1.  Power off the device completely.
2.  Press and hold **Volume Down + Home + Power** simultaneously until the warning screen appears.
3.  Press **Volume Up** to enter Download Mode.
4.  Connect the device to your PC using a high-quality USB cable.



<figure>
  <img src="https://image-us.samsung.com/SamsungUS/support/solutions/mobile/phones/galaxy-s/s21/PH_GS_S21_Samsung_phone_or_tablet_stuck_in_Download_mode.png?$support-tsg-hero-png$|width=400" alt="Placeholder test image" />
</figure>


### Step 3: Flashing TWRP Recovery

*   Download the official raw TWRP image for the SM-G925F (`twrp-x.x.x-x-zeroltexx.img`) from [here](https://twrp.me/). Do not use the `.tar` archive.
*   Rename the file to `twrp.img` and navigate to its directory in your terminal.
*   i will be using linux to flash the TWRP Recovery
*   Verify your connection:
    
    bash
    
        heimdall detect
        
    
    Use code with caution.
    
*   Flash the image directly to the recovery partition using the `--no-reboot` flag to prevent the stock Android OS from overwriting your custom recovery:
    
    bash
    
        heimdall flash --RECOVERY twrp.img --no-reboot
        
    
    Use code with caution.
    

<figure>
  <img src="/s6_root/twrp.png" alt="Placeholder test image" />
  <figcaption>After reboot you will see</figcaption>
</figure>

---

### Phase 2: Rooting & LineageOS Installation

### Step 1: Wipe the Device

1.  Disconnect the phone. Force reboot by holding **Volume Down + Power**, then immediately switch to holding **Volume Up + Home + Power** to boot straight into TWRP Recovery.
2.  Inside TWRP, select **Wipe > Advanced Wipe**.
3.  Check **Dalvik / ART Cache, System, Data, and Cache**, then swipe to wipe.

### Step 2: Sideload or Transfer Files


download **LineageOS 14.1** which was compatible with my samsung s6 edge from [here](https://sourceforge.net/projects/retiredtab/files/SM-T113/14.1/lineage-14.1-20240507-UNOFFICIAL-SM-T113.zip/download) and **Magisk zip** from [here](https://github.com/topjohnwu/Magisk/releases)
Transfer your **LineageOS ROM zip** and **Magisk zip** (for root) to your device via MTP, or use ADB Sideload:

1.  In TWRP, go to **Advanced > ADB Sideload** and swipe to start.
2.  From your PC terminal, run:
    
    bash
    
        adb sideload lineage-os-version.zip
        adb sideload Magisk-version.zip
        
        
    Use code with caution.
    

### Step 3: Flash and Reboot

1.  If not using sideload, tap **Install** in TWRP, select the LineageOS zip, and swipe to confirm.
2.  Repeat the install process for the **Magisk zip** to achieve root access.
3.  Once all zip files are flashed, tap **Reboot System**.
4.  Complete the initial LineageOS setup wizard. Open the Magisk app to finalize root configurations.

> some times the Magisk-version.zip does not install properly so we can then perform an adb install

rename the Magisk-version.zip to adb sideload Magisk-version.apk and run the following command 

```bash
adb install Magisk-version.apk
```

<figure>
  <img src="/s6_root/magisk.png|width=400" alt="magisk" />
</figure>


* * *

### Phase 3: Installing Kali NetHunter  

### Step 1: Download NetHunter Image

1.  Download the **Kali NetHunter Kirin/Generic ARM64 Chroot** zip from [here](https://www.kali.org/get-kali/#kali-mobile)

### Step 2: Flash NetHunter via TWRP or Magisk

1.  we will use Magisk to install nethunter

go to **modules** tab in the Magisk app and you would see **install from storage** click it and navigate to nethunter.zip 

this will not work because the Minimal LineageOS installations often lack an integrated documents 
explorer framework, which causes the Magisk application file picker to freeze or fail when selecting 
modules. You must install a standalone file manager over ADB first:

i will be using [mixplorer](https://mixplorer.en.uptodown.com/android)

download the apk and then perform an install using this command 


```bash
adb install mixplorer-x-xx.apk
```

now instead of using the default file explorer use the mixplorer app to nevigate to nethunter.zip and install it

<figure>
  <img src="/s6_root/open_with.png|width=400" alt="open with" />
</figure>



---

### Phase 4: Enabling HID via kernel package

The stock LineageOS kernel does not natively support USB HID gadget simulation (`/dev/hidg0`). You must inject or patch the kernel module.

### Step 1: Check Pre-compiled Modules

we will be using **kernel-nethunter-20231005_083817-zerolte-nougat.zip**

* This is a custom Android operating system kernel package designed specifically for cybersecurity testing.
* It modifies a Samsung Galaxy S6 Edge running Android 7 (Nougat) to grant advanced hardware controls.
* Its primary purpose is to enable specialized hacker attacks like USB HID keyboard emulation and Wi-Fi injection.
* It unlocks raw USB hardware permissions that are completely blocked by default on standard commercial phones.

you could find this file from [here](help)

to install it you can use the same procedure to install the nethunter

now lets check if it works or not

```bash
 ls -l /dev/hidg*
```

first execute the following command with out connecting the cable 


<figure>
  <img src="/s6_root/1.png|width=700" alt="open with" />
</figure>

now lets run the command with cable attached 

<figure>
  <img src="/s6_root/2.png|width=700" alt="open with" />
</figure>


Connecting the phone successfully generated **/dev/hidraw2** and **/dev/hidraw3** interfaces on your PC, proving that the computer recognizes your phone as an active USB keyboard/mouse.
This confirms your custom kernel and USB spoofing setup are working perfectly, meaning your S6 Edge is officially ready to execute DuckHunter payloads.

---

### Phase 5: Executing DuckHunter Exploits

DuckHunter converts standard **USB Rubber Ducky scripts** (Duckyscript) into raw commands that NetHunter's HID system can inject seamlessly.


you could get duck hunter from [here](https://github.com/byt3bl33d3r/duckhunter)

### Step 1: Prepare Your Duckyscript

lets just create an payload to prank rickroll 


```text
REM Title: Windows Rickroll for DuckyHunter
REM Wait for device enumeration
DELAY 1000

REM Open Windows Run dialog
GUI r
DELAY 600

REM Type the URL to launch the default browser
REM Note: STRING automatically presses ENTER in DuckyHunter
STRING https://www.youtube.com/shorts/Ay8lynMZ4mE
```

then use this command to convert to `.sh` file 

```bash
python duckhunter.py scripts/rick_roll_win duck_out.sh
```

this will save the out put file in the duck_out.sh

now the file would have the following 

```bash
# Title: Windows Rickroll for DuckyHunter
# Wait for device enumeration
sleep 1
# Open Windows Run dialog
echo left-meta r | hid-keyboard /dev/hidg0 keyboard
sleep 0.6
# Type the URL to launch the default browser
# Note: STRING automatically presses enter in DuckyHunter
echo h | hid-keyboard /dev/hidg0 keyboard
echo t | hid-keyboard /dev/hidg0 keyboard
echo t | hid-keyboard /dev/hidg0 keyboard
echo p | hid-keyboard /dev/hidg0 keyboard
echo s | hid-keyboard /dev/hidg0 keyboard
echo left-shift semicolon | hid-keyboard /dev/hidg0 keyboard
echo slash | hid-keyboard /dev/hidg0 keyboard
echo slash | hid-keyboard /dev/hidg0 keyboard
echo w | hid-keyboard /dev/hidg0 keyboard
echo w | hid-keyboard /dev/hidg0 keyboard
echo w | hid-keyboard /dev/hidg0 keyboard
echo period | hid-keyboard /dev/hidg0 keyboard
echo y | hid-keyboard /dev/hidg0 keyboard
echo o | hid-keyboard /dev/hidg0 keyboard
echo u | hid-keyboard /dev/hidg0 keyboard
echo t | hid-keyboard /dev/hidg0 keyboard
echo u | hid-keyboard /dev/hidg0 keyboard
echo b | hid-keyboard /dev/hidg0 keyboard
echo e | hid-keyboard /dev/hidg0 keyboard
echo period | hid-keyboard /dev/hidg0 keyboard
echo c | hid-keyboard /dev/hidg0 keyboard
echo o | hid-keyboard /dev/hidg0 keyboard
echo m | hid-keyboard /dev/hidg0 keyboard
echo slash | hid-keyboard /dev/hidg0 keyboard
echo s | hid-keyboard /dev/hidg0 keyboard
echo h | hid-keyboard /dev/hidg0 keyboard
echo o | hid-keyboard /dev/hidg0 keyboard
echo r | hid-keyboard /dev/hidg0 keyboard
echo t | hid-keyboard /dev/hidg0 keyboard
echo s | hid-keyboard /dev/hidg0 keyboard
echo slash | hid-keyboard /dev/hidg0 keyboard
echo left-shift a | hid-keyboard /dev/hidg0 keyboard
echo y | hid-keyboard /dev/hidg0 keyboard
echo 8 | hid-keyboard /dev/hidg0 keyboard
echo l | hid-keyboard /dev/hidg0 keyboard
echo y | hid-keyboard /dev/hidg0 keyboard
echo n | hid-keyboard /dev/hidg0 keyboard
echo left-shift m | hid-keyboard /dev/hidg0 keyboard
echo left-shift z | hid-keyboard /dev/hidg0 keyboard
echo 4 | hid-keyboard /dev/hidg0 keyboard
echo m | hid-keyboard /dev/hidg0 keyboard
echo left-shift e | hid-keyboard /dev/hidg0 keyboard
echo enter | hid-keyboard /dev/hidg0 keyboard
```

### Phase 6: DuckHunter USB Exploits

now lets give the file executable permissions 

```bash
chmod +x duck_out.sh
```

now connect the file to the windows machine 

```bash
./duck_out.sh
```

<video controls width="100%" style="max-width: 800px; margin: 2rem auto; display: block; border: 1px solid #222; border-radius: 4px;">
  <source src="/s6_root/demo.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

here we can see that we have successfully performed an hid attack on win machine

<figure>
  <img src="/s6_root/devicemaneger.png" alt="open with" />
  <figcaption>we can also see that there are two keyboard and mouse connected to the pc</figcaption>
</figure>




before writing scripts for duckhunter plz know the following 


* Uses Ducky Script 1.0: Kali NetHunter's DuckHunter uses legacy 1.0 syntax in ALL-CAPS, completely lacking version 3.0's advanced variables or if/else logic.
* Auto-Enter Behavior: Unlike standard scripts, DuckHunter’s STRING command automatically hits Enter after typing out text.
* Unique TEXT Command: It introduces a specialized TEXT command specifically to type characters without submitting an Enter keypress.
* Bonus Mouse Support: It extends basic 1.0 features by adding mouse simulation commands like MOUSE LEFTCLICK and cursor movement.
* No .bin Compilation: It skips standard hardware compilation, translating raw .txt files directly into Android-executable .sh shell scripts.

so you cannot also use even raw 1.0 duckscripts either you need to first modify it to be used by duckhunter

i will be making my own script you can access them from [here](help)


<br>
<br>
<br>


<pre class="ascii-art">
----------------------------------------------------------------------------------------------------------------------------------------------------------
||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||  END OF FILE  |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
----------------------------------------------------------------------------------------------------------------------------------------------------------
</pre>