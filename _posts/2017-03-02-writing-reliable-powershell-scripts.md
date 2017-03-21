---
layout: post
title: Writing Reliable PowerShell scripts
date: 2017-03-02
banner_image: reliable-powershell.png
tags: [PowerShell, Windows, IT, Automation]
---

Automating tasks with PowerShell is awesome - but When you start to automate more complex tasks that run on production servers, it's important that your PowerShell scripts do what you expect them to. And if they don't - they should handle themselves appropriately. In this article I'll be discussing a few ways you can write better, more reliable PowerShell scripts.

In this example we'll be improving upon a script set to run via Task Scheduler each month on a file server that updates a local Office 365 deployment share. We'll start with the basic tasks that need to be completed and make some important adjustments to make this script rock-solid. Here's our initial code, containing only the bare-minimum tasks that need to be completed:

<script src="https://gist.github.com/jacobboykin/4c5a987d40a3a3d3b92050f3f62c4d9d.js"></script>

If you're not familiar with Office 365 Click-to-run deployment this might look a bit weird, but for the purposes of this demonstration this is all we're trying to do:
1. Check if a folder exists
2. Delete that folder if it does exist
3. Start a setup.exe application

Now, this works just fine - but this needs to run **unattended**, on a **schedule** and on a **production** file server. We can make a few simple adjustments to give ourselves some insights into this tasks' performance and give us some peace of mind. 
