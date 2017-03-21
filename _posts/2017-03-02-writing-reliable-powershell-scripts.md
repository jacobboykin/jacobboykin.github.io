---
layout: post
title: Writing Reliable PowerShell scripts
date: 2017-03-02
banner_image: reliable-powershell.png
tags: [PowerShell, Windows, IT, Automation]
---

Automating tasks with PowerShell is awesome - but when you begin to automate more complex tasks that run on production servers, it's important that your PowerShell scripts do what you expect them to. And if they don't - they should handle themselves appropriately. In this article I'll be discussing a few ways you can write better, more reliable PowerShell scripts.

![alt tag](https://raw.githubusercontent.com/jacobboykin/100-days-of-code/master/img/day_7.gif)

We'll be improving upon a script set to run via Task Scheduler each month on a file server that updates a local Office 365 deployment share. We'll start with the basic tasks that need to be completed and make some important adjustments to make this script rock-solid. Here's our initial code, containing only the bare-minimum tasks that need to be completed:

<pre><code class="language-powershell">$setupEXE = "C:\Apps\Office-365\Source\setup.exe"
$arguments = "/download C:\Apps\Office-365\Source\Download.xml"

# Delete current office source if it exists
if (Test-Path "C:\Apps\Office-365\Source\Office") {
  Remove-Item "C:\Apps\Office-365\Source\Office" -Recurse -Force
}

# Run setup.exe in download mode
Start-Process -FilePath $setupEXE -ArgumentList $arguments -Wait</code></pre>

If you're not familiar with Office 365 Click-to-run deployment this might look a bit weird, but for the purposes of this demonstration this is all we're trying to do:
1. Check if a folder exists
2. Delete that folder if it exists
3. Start a setup.exe application that will download a bunch of files to that folder

Now, this works just fine - but this needs to run **unattended**, on a **schedule** and on a **production** file server. We can make a few simple adjustments to give ourselves some insights into this tasks' performance and give us some peace of mind. 

## Start-Transcript

## ErrorActionPreference

## Try, Catch, Finally

## Send an E-mail!

## ISE Debugging

## PowerShell versions

## Verify Success

