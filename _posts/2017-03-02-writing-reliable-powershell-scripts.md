---
layout: post
title: Writing Reliable PowerShell scripts
date: 2017-03-02
banner_image: reliable-powershell.png
tags: [PowerShell, Windows, IT, Automation]
---

When you start to automate all the things with PowerShell, especially when the things in question become complex tasks run on production servers, it's important that your PowerShell scripts do what you expect them to. And if they don't - they should handle themselves appropriately. In this article I'll be discussing a few ways you can write better, more reliable PowerShell scripts.

In this example we'll be improving upon a script set to run via Task Scheduler each month on a file server that updates a local Office 365 deployment share. We'll start with the basic tasks that need to be completed and make some important adjustments to make this script rock-solid. Here's our initial code, containing only the bare-minimum tasks that need to be completed:

```PowerShell
$setupEXE = "C:\Apps\Office-365\Source\setup.exe"
$arguments = "/download C:\Apps\Office-365\Source\Download.xml"

# Delete current office source if it exists
if (Test-Path "C:\Apps\Office-365\Source\Office") {
  Remove-Item "C:\Apps\Office-365\Source\Office" -Recurse -Force
}

# Run setup.exe in download mode
Start-Process -FilePath $setupEXE -ArgumentList $arguments -Wait
```

<script src="https://gist.github.com/jacobboykin/4c5a987d40a3a3d3b92050f3f62c4d9d.js"></script>

If you're not familiar with Office 365 Click-to-run deployment this might look a bit weird, but the details aren't too important. All we're doing here is deleting old Office source files if they exist on our server, then running the Office 365 Click-to-run setup.exe to download the latest Deferred Channel build of Office as defined in the Download.xml file. Of course, the steps we take to make these tasks run more reliably are the key take-a-way here.
