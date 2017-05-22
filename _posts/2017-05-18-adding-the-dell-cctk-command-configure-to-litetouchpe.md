---
layout: post
title: Adding the Dell CCTK (Command | Configure) to Your LiteTouchPE Images
date: 2017-05-18
banner_image: sccm-windows10-query.png
tags: [MDT, WDS, LiteTouchPE, WinPE, PowerShell, Windows]
---

### Hello! 👋

1.) Download and install the latest Dell Command &#124; Configure (CCTK) on your MDT server. At the time of writing, you can grab this over [here](http://en.community.dell.com/techcenter/enterprise-client/w/wiki/7532.dell-command-configure).

2.) Open up the LiteTouchPE.xml template located at *"C:\Program Files\Microsoft Deployment Toolkit\Templates"*. We want to use this same structure to copy over each file needed for the Dell CCTk onto out LiteTouchPE images.

{% include image_caption.html
  imageurl="https://jacobboykin.com/images/posts/adding-the-dell-cctk-command-configure-to-litetouchpe/01.png"
  title="Editing the LiteTouchPE.xml"%}


<pre><code class="xml" >&lt;Copy source="dell_CCTK_Path\cctk.exe" dest="CCTK\cctk.exe" /&gt;
</code></pre>

Adding each file we need for x64 and x86 would be *quite* tedious so we'll write some quick PowerShell to generate the xml that we need to make this happen 😎 . If you're cool with the paths I'm using here, just copy and paste the full XML at the end of this post without running this snippet.

<pre><code class="powershell">$dellCCTKPath_x86 = "C:\Program Files (x86)\Dell\Command Configure\X86"
$dellHAPIPath_x86 = "C:\Program Files (x86)\Dell\Command Configure\X86\HAPI"
$dellCCTKPath_x64 = "C:\Program Files (x86)\Dell\Command Configure\X86_64"
$dellHAPIPath_x64 = "C:\Program Files (x86)\Dell\Command Configure\X86_64\HAPI"

Write-Host "`n&lt;!-- Dell CCTK x86 --&gt;`n"
Get-ChildItem $dellCCTKPath_x86 | % { Write-Host "&lt;Copy source=`"$($_.FullName)`" dest=`"CCTK\$($_.Name)`" /&gt;" }

Write-Host "`n&lt;!-- Dell HAPI x86 --&gt;`n"
Get-ChildItem $dellHAPIPath_x86 | % { Write-Host "&lt;Copy source=`"$($_.FullName)`" dest=`"CCTK\HAPI\$($_.Name)`" /&gt;" }

Write-Host "`n&lt;!-- Dell CCTK x64 --&gt;`n"
Get-ChildItem $dellCCTKPath_x64 | % { Write-Host "&lt;Copy source=`"$($_.FullName)`" dest=`"CCTK_x64\$($_.Name)`" /&gt;" }

Write-Host "`n&lt;!-- Dell HAPI x64 --&gt;`n"
Get-ChildItem $dellHAPIPath_x64 | % { Write-Host "&lt;Copy source=`"$($_.FullName)`" dest=`"CCTK_x64\HAPI\$($_.Name)`" /&gt;" }</code></pre>

Let's break this down real quick. All this code does is grab each item in the directories that we need and write them to the PowerShell console in the format we need. Here's what we've got after running this (full XML at the end of this post):

{% include image_caption.html
  imageurl="https://jacobboykin.com/images/posts/adding-the-dell-cctk-command-configure-to-litetouchpe/02.png"
  title="PowerShell generating the template XML"%}

3.) Paste the XML we generated into the Content tag of the LiteTouchPE.xml and open up the MDT Deployment Workbench. Run the **Update Deployment Share Wizard** for your deployment share. The wizard will notice that changes were made, and will add the Dell files we specified to our LitetouchPE images. Errors will be logged if the wizard can't find the files you specified.

{% include image_caption.html
  imageurl="https://jacobboykin.com/images/posts/adding-the-dell-cctk-command-configure-to-litetouchpe/03.png"
  title="Update Deployment Share Wizard"%}

4.) You can check out if this worked out like you expected by opening up the .iso and boot.wim in 7zip or mounting them.

{% include image_caption.html
  imageurl="https://jacobboykin.com/images/posts/adding-the-dell-cctk-command-configure-to-litetouchpe/04.png"
  title="Verify Dell CCTK is in ISO"%}

5.) Now you can add steps to your task sequences to install the HAPI drivers and reference the CCTK! 🔥
