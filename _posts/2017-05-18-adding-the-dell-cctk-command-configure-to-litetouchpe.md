---
layout: post
title: Adding the Dell CCTK (Command | Configure) to Your LiteTouchPE Images
date: 2017-05-18
banner_image: dell-cctk-command-configure.png
tags: [MDT, LiteTouchPE, WinPE, PowerShell, Windows]
---

Whether you're performing in-place upgrades and need to convert machines from BIOS to UEFI or just want to totally automate your BIOS configuration, you'll need your device manufacturer's tools in your LiteTouchPE images to run in your MDT task sequences. For your Dell machines, it's pretty simple to add the Dell CCTK (Command &#124; Configure) to your LiteTouchPE images permanently by modifying an MDT template file. Let's begin!

<!--more-->

1.) Download and install the latest Dell Command &#124; Configure (CCTK) on your MDT server. At the time of writing, you can grab this over [here](http://en.community.dell.com/techcenter/enterprise-client/w/wiki/7532.dell-command-configure).

2.) Open up the LiteTouchPE.xml template located at *"C:\Program Files\Microsoft Deployment Toolkit\Templates"*. This template dictates what components and files should be included in any LiteTouchPE images generated in the Deployment Workbench. We'll need to add the necessary Dell CCTK files and HAPI drivers to the **Content** section of this XML file. For more info on how this works, check out [this Michael Niehaus blog post](https://blogs.technet.microsoft.com/mniehaus/2009/07/10/mdt-2010-new-feature-17-customizable-boot-image-process/).

{% include image_caption.html
  imageurl="https://jacobboykin.com/images/posts/adding-the-dell-cctk-command-configure-to-litetouchpe/01.png"
  title="Editing the LiteTouchPE.xml"%}

Looking at the LiteTouchPE.xml **Copy** tags you'll see that we need the following structure for each file we'd like copied to our images:

<pre><code class="xml" >&lt;Copy source="dell_CCTK_Path\cctk.file" dest="CCTK\cctk.file" /&gt;
</code></pre>

Adding each file for each bitness would be *quite* tedious so we'll write some quick PowerShell to generate the XML 😎 . If you're cool with the paths I'm using here, just copy and paste the full XML at the end of this post.

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

This code fetches each item in the Dell CCTK directories and writes them to the PowerShell console in the XML syntax we need. Now we can just copy and paste the XML into the LitetouchPE.xml file.

{% include image_caption.html
  imageurl="https://jacobboykin.com/images/posts/adding-the-dell-cctk-command-configure-to-litetouchpe/02.png"
  title="PowerShell generating the template XML"%}

3.) After pasting the XML we generated into the **Content** tag of the LiteTouchPE.xml, open up the MDT Deployment Workbench. Run the **Update Deployment Share Wizard** for your deployment share. The wizard will notice that changes were made, and will add the Dell files we specified to our LitetouchPE images. Errors will be logged if the wizard can't find the files you specified.

{% include image_caption.html
  imageurl="https://jacobboykin.com/images/posts/adding-the-dell-cctk-command-configure-to-litetouchpe/03.png"
  title="Update Deployment Share Wizard"%}

4.) You can check if this worked out as expected by opening up the .iso and boot.wim in 7zip.

{% include image_caption.html
  imageurl="https://jacobboykin.com/images/posts/adding-the-dell-cctk-command-configure-to-litetouchpe/04.png"
  title="Verify Dell CCTK is in ISO"%}

5.) Now you can add steps to your task sequences to install the HAPI drivers and reference the CCTK! 🔥

{% include image_caption.html
  imageurl="https://jacobboykin.com/images/posts/adding-the-dell-cctk-command-configure-to-litetouchpe/05.png"
  title="Editing the LiteTouchPE.xml"%}

If you want to learn more about using the Dell CCTK in your task sequences, check out these excellent resources:

- [Running Dell Command and Configure commands in MDT or SCCM Task Sequences](http://www.dell.com/support/article/us/en/19/SLN299182/running-dell-command-and-configure--formerly-client-configuration-tool-kit--cctk---commands-in-microsoft-deployment-toolkit--mdt--or-system-center-configuration-manager--sccm--task-sequences?lang=EN)
- [Moving from BIOS to UEFI with MDT 8443](https://blogs.technet.microsoft.com/mniehaus/2017/04/14/moving-from-bios-to-uefi-with-mdt-8443/)
- [Automating Dell BIOS-UEFI Standards for Windows 10](https://miketerrill.net/2015/08/31/automating-dell-bios-uefi-standards-for-windows-10/)

### Full LiteTouchPE.xml with CCTK x86 & x64

<pre><code class="xml">&lt;Definition&gt;
  &lt;WindowsPE&gt;

	&lt;!-- Settings --&gt;
	&lt;Version /&gt;
	&lt;Source /&gt;
	&lt;ScratchSpace&gt;64&lt;/ScratchSpace&gt;
	&lt;ImageName /&gt;
	&lt;ImageDescription /&gt;

	&lt;!-- Components --&gt;
	&lt;Components&gt;
	  &lt;Component&gt;winpe-hta&lt;/Component&gt;
	  &lt;Component&gt;winpe-scripting&lt;/Component&gt;
	  &lt;Component&gt;winpe-wmi&lt;/Component&gt;
	  &lt;Component&gt;winpe-securestartup&lt;/Component&gt;
	  &lt;Component&gt;winpe-fmapi&lt;/Component&gt;
	&lt;/Components&gt;

	&lt;!-- Driver and packages --&gt;
	&lt;Drivers /&gt;
	&lt;Packages /&gt;

	&lt;!-- Content --&gt;
	&lt;Content&gt;

	  &lt;!-- Configuration --&gt;
	  &lt;Copy source="%DEPLOYROOT%\Control\Bootstrap.ini" dest="Deploy\Scripts\Bootstrap.ini" /&gt;
	  &lt;Copy source="%INSTALLDIR%\Templates\Unattend_PE_%PLATFORM%.xml" dest="Unattend.xml" /&gt;
	  &lt;Copy source="%INSTALLDIR%\Templates\winpeshl.ini" dest="Windows\system32\winpeshl.ini" /&gt;

	  &lt;!-- Scripts --&gt;
	  &lt;Copy source="%DEPLOYROOT%\Scripts\LiteTouch.wsf" dest="Deploy\Scripts\LiteTouch.wsf" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Scripts\ZTIUtility.vbs" dest="Deploy\Scripts\ZTIUtility.vbs" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Scripts\ZTIBCDUtility.vbs" dest="Deploy\Scripts\ZTIBCDUtility.vbs" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Scripts\ZTIDiskUtility.vbs" dest="Deploy\Scripts\ZTIDiskUtility.vbs" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Scripts\ZTIDataAccess.vbs" dest="Deploy\Scripts\ZTIDataAccess.vbs" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Scripts\ZTIConfigFile.vbs" dest="Deploy\Scripts\ZTIConfigFile.vbs" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Scripts\ZTIGather.wsf" dest="Deploy\Scripts\ZTIGather.wsf" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Scripts\ZTIGather.xml" dest="Deploy\Scripts\ZTIGather.xml" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Scripts\Wizard.hta" dest="Deploy\Scripts\Wizard.hta" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Scripts\Credentials_ENU.xml" dest="Deploy\Scripts\Credentials_ENU.xml" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Scripts\Credentials_scripts.vbs" dest="Deploy\Scripts\Credentials_scripts.vbs" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Scripts\WizUtility.vbs" dest="Deploy\Scripts\WizUtility.vbs" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Scripts\Wizard.css" dest="Deploy\Scripts\Wizard.css" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Scripts\Wizard.ico" dest="Deploy\Scripts\Wizard.ico" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Scripts\BackButton.jpg" dest="Deploy\Scripts\BackButton.jpg" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Scripts\plusicon.gif" dest="Deploy\Scripts\plusicon.gif" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Scripts\minusico.gif" dest="Deploy\Scripts\minusico.gif" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Scripts\Summary_Definition_ENU.xml" dest="Deploy\Scripts\Summary_Definition_ENU.xml" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Scripts\Summary_scripts.vbs" dest="Deploy\Scripts\Summary_scripts.vbs" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Scripts\LTICleanup.wsf" dest="Deploy\Scripts\LTICleanup.wsf" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Scripts\BDD_Welcome_ENU.xml" dest="Deploy\Scripts\BDD_Welcome_ENU.xml" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Scripts\WelcomeWiz_Choice.xml" dest="Deploy\Scripts\WelcomeWiz_Choice.xml" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Scripts\WelcomeWiz_Choice.vbs" dest="Deploy\Scripts\WelcomeWiz_Choice.vbs" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Scripts\WelcomeWiz_DeployRoot.xml" dest="Deploy\Scripts\WelcomeWiz_DeployRoot.xml" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Scripts\WelcomeWiz_DeployRoot.vbs" dest="Deploy\Scripts\WelcomeWiz_DeployRoot.vbs" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Scripts\WelcomeWiz_Initialize.xml" dest="Deploy\Scripts\WelcomeWiz_Initialize.xml" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Scripts\WelcomeWiz_Initialize.vbs" dest="Deploy\Scripts\WelcomeWiz_Initialize.vbs" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Scripts\SelectItem.jpg" dest="Deploy\Scripts\SelectItem.jpg" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Scripts\WelcomeBanner.jpg" dest="Deploy\Scripts\WelcomeBanner.jpg" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Scripts\btnout.png" dest="Deploy\Scripts\btnout.png" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Scripts\btnover.png" dest="Deploy\Scripts\btnover.png" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Scripts\btnsel.png" dest="Deploy\Scripts\btnsel.png" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Scripts\LTIGetFolder.wsf" dest="Deploy\Scripts\LTIGetFolder.wsf" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Scripts\NICSettings_Definition_ENU.xml" dest="Deploy\Scripts\NICSettings_Definition_ENU.xml" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Scripts\ZTINicUtility.vbs" dest="Deploy\Scripts\ZTINicUtility.vbs" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Scripts\ZTINicConfig.wsf" dest="Deploy\Scripts\ZTINicConfig.wsf" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Scripts\BackButton.png" dest="Deploy\Scripts\BackButton.png" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Scripts\FolderIcon.png" dest="Deploy\Scripts\FolderIcon.png" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Scripts\ItemIcon1.png" dest="Deploy\Scripts\ItemIcon1.png" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Scripts\MinusIcon1.png" dest="Deploy\Scripts\MinusIcon1.png" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Scripts\PlusIcon1.png" dest="Deploy\Scripts\PlusIcon1.png" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Scripts\SelectItem.png" dest="Deploy\Scripts\SelectItem.png" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Scripts\header-image.png" dest="Deploy\Scripts\header-image.png" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Scripts\NavBar.png" dest="Deploy\Scripts\NavBar.png" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Scripts\Computer.png" dest="Deploy\Scripts\Computer.png" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Scripts\WelcomeWiz_Background.jpg" dest="Deploy\Scripts\WelcomeWiz_Background.jpg" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Scripts\DeployWiz_Administrator.png" dest="Deploy\Scripts\DeployWiz_Administrator.png" /&gt;

	  &lt;!-- Tools --&gt;
	  &lt;Copy source="%DEPLOYROOT%\Tools\%PLATFORM%\BDDRUN.exe" dest="Windows\system32\BDDRUN.exe" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Tools\%PLATFORM%\WinRERUN.exe" dest="Deploy\Tools\%PLATFORM%\WinRERUN.exe" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Tools\%PLATFORM%\CcmCore.dll" dest="Deploy\Tools\%PLATFORM%\CcmCore.dll" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Tools\%PLATFORM%\CcmUtilLib.dll" dest="Deploy\Tools\%PLATFORM%\CcmUtilLib.dll" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Tools\%PLATFORM%\Smsboot.exe" dest="Deploy\Tools\%PLATFORM%\Smsboot.exe" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Tools\%PLATFORM%\SmsCore.dll" dest="Deploy\Tools\%PLATFORM%\SmsCore.dll" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Tools\%PLATFORM%\TsCore.dll" dest="Deploy\Tools\%PLATFORM%\TsCore.dll" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Tools\%PLATFORM%\TSEnv.exe" dest="Deploy\Tools\%PLATFORM%\TSEnv.exe" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Tools\%PLATFORM%\TsManager.exe" dest="Deploy\Tools\%PLATFORM%\TsManager.exe" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Tools\%PLATFORM%\TsmBootstrap.exe" dest="Deploy\Tools\%PLATFORM%\TsmBootstrap.exe" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Tools\%PLATFORM%\TsMessaging.dll" dest="Deploy\Tools\%PLATFORM%\TsMessaging.dll" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Tools\%PLATFORM%\TsmBootstrap.exe" dest="Deploy\Tools\%PLATFORM%\TsmBootstrap.exe" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Tools\%PLATFORM%\TsProgressUI.exe" dest="Deploy\Tools\%PLATFORM%\TsProgressUI.exe" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Tools\%PLATFORM%\TSResNlc.dll" dest="Deploy\Tools\%PLATFORM%\TSResNlc.dll" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Tools\%PLATFORM%\CommonUtils.dll" dest="Deploy\Tools\%PLATFORM%\CommonUtils.dll" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Tools\%PLATFORM%\ccmgencert.dll" dest="Deploy\Tools\%PLATFORM%\ccmgencert.dll" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Tools\%PLATFORM%\msvcp120.dll" dest="Deploy\Tools\%PLATFORM%\msvcp120.dll" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Tools\%PLATFORM%\msvcr120.dll" dest="Deploy\Tools\%PLATFORM%\msvcr120.dll" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Tools\%PLATFORM%\00000409\tsres.dll" dest="Deploy\Tools\%PLATFORM%\00000409\tsres.dll" /&gt;
	  &lt;Copy source="%DEPLOYROOT%\Tools\%PLATFORM%\Microsoft.BDD.Utility.dll" dest="Deploy\Tools\%PLATFORM%\Microsoft.BDD.Utility.dll" /&gt;

    &lt;!-- Dell CCTK x86 --&gt;

    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86\HAPI" dest="CCTK\HAPI" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86\BIOSIntf.dll" dest="CCTK\BIOSIntf.dll" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86\cctk.exe" dest="CCTK\cctk.exe" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86\cctk_x86_WinPE.bat" dest="CCTK\cctk_x86_WinPE.bat" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86\cctk_x86_winpe_10.bat" dest="CCTK\cctk_x86_winpe_10.bat" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86\cctk_x86_WinPE_3.bat" dest="CCTK\cctk_x86_WinPE_3.bat" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86\cctk_x86_winpe_4.bat" dest="CCTK\cctk_x86_winpe_4.bat" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86\cctk_x86_winpe_5.bat" dest="CCTK\cctk_x86_winpe_5.bat" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86\mxml1.dll" dest="CCTK\mxml1.dll" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86\pci.ids" dest="CCTK\pci.ids" /&gt;

    &lt;!-- Dell HAPI x86 --&gt;

    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86\HAPI\dcdbas32.cat" dest="CCTK\HAPI\dcdbas32.cat" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86\HAPI\dcdbas32.inf" dest="CCTK\HAPI\dcdbas32.inf" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86\HAPI\dcdbas32.sys" dest="CCTK\HAPI\dcdbas32.sys" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86\HAPI\dcdesm32.sys" dest="CCTK\HAPI\dcdesm32.sys" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86\HAPI\dcdipm32.sys" dest="CCTK\HAPI\dcdipm32.sys" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86\HAPI\dcdtvm32.sys" dest="CCTK\HAPI\dcdtvm32.sys" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86\HAPI\dcesm.sys" dest="CCTK\HAPI\dcesm.sys" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86\HAPI\dcesmwdm.sys" dest="CCTK\HAPI\dcesmwdm.sys" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86\HAPI\dchapi32.dll" dest="CCTK\HAPI\dchapi32.dll" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86\HAPI\dchbas32.dll" dest="CCTK\HAPI\dchbas32.dll" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86\HAPI\dchcfg32.exe" dest="CCTK\HAPI\dchcfg32.exe" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86\HAPI\dchcfl32.dll" dest="CCTK\HAPI\dchcfl32.dll" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86\HAPI\dchesm32.dll" dest="CCTK\HAPI\dchesm32.dll" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86\HAPI\dchipm32.dll" dest="CCTK\HAPI\dchipm32.dll" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86\HAPI\dchtst32.exe" dest="CCTK\HAPI\dchtst32.exe" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86\HAPI\dchtvm32.dll" dest="CCTK\HAPI\dchtvm32.dll" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86\HAPI\dciwds32.exe" dest="CCTK\HAPI\dciwds32.exe" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86\HAPI\dcmdev32.exe" dest="CCTK\HAPI\dcmdev32.exe" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86\HAPI\dcwipm32.dll" dest="CCTK\HAPI\dcwipm32.dll" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86\HAPI\HAPIInstall.bat" dest="CCTK\HAPI\HAPIInstall.bat" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86\HAPI\hapint.exe" dest="CCTK\HAPI\hapint.exe" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86\HAPI\HAPIUninstall.bat" dest="CCTK\HAPI\HAPIUninstall.bat" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86\HAPI\omsacntl.exe" dest="CCTK\HAPI\omsacntl.exe" /&gt;

    &lt;!-- Dell CCTK x64 --&gt;

    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86_64\HAPI" dest="CCTK_x64\HAPI" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86_64\BIOSIntf.dll" dest="CCTK_x64\BIOSIntf.dll" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86_64\cctk.exe" dest="CCTK_x64\cctk.exe" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86_64\cctk_x86_64_winpe.bat" dest="CCTK_x64\cctk_x86_64_winpe.bat" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86_64\cctk_x86_64_winpe_10.bat" dest="CCTK_x64\cctk_x86_64_winpe_10.bat" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86_64\cctk_x86_64_WinPE_3.bat" dest="CCTK_x64\cctk_x86_64_WinPE_3.bat" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86_64\cctk_x86_64_winpe_4.bat" dest="CCTK_x64\cctk_x86_64_winpe_4.bat" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86_64\cctk_x86_64_winpe_5.bat" dest="CCTK_x64\cctk_x86_64_winpe_5.bat" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86_64\mxml1.dll" dest="CCTK_x64\mxml1.dll" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86_64\pci.ids" dest="CCTK_x64\pci.ids" /&gt;

    &lt;!-- Dell HAPI x64 --&gt;

    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86_64\HAPI\dcdbas32.cat" dest="CCTK_x64\HAPI\dcdbas32.cat" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86_64\HAPI\dcdbas32.inf" dest="CCTK_x64\HAPI\dcdbas32.inf" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86_64\HAPI\dcdbas32.sys" dest="CCTK_x64\HAPI\dcdbas32.sys" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86_64\HAPI\dcdbas64.cat" dest="CCTK_x64\HAPI\dcdbas64.cat" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86_64\HAPI\dcdbas64.inf" dest="CCTK_x64\HAPI\dcdbas64.inf" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86_64\HAPI\dcdbas64.sys" dest="CCTK_x64\HAPI\dcdbas64.sys" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86_64\HAPI\dcdipm64.sys" dest="CCTK_x64\HAPI\dcdipm64.sys" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86_64\HAPI\dchapi32.dll" dest="CCTK_x64\HAPI\dchapi32.dll" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86_64\HAPI\dchapi64.dll" dest="CCTK_x64\HAPI\dchapi64.dll" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86_64\HAPI\dchbas32.dll" dest="CCTK_x64\HAPI\dchbas32.dll" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86_64\HAPI\dchbas64.dll" dest="CCTK_x64\HAPI\dchbas64.dll" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86_64\HAPI\dchcfg32.exe" dest="CCTK_x64\HAPI\dchcfg32.exe" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86_64\HAPI\dchcfg64.exe" dest="CCTK_x64\HAPI\dchcfg64.exe" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86_64\HAPI\dchcfl32.dll" dest="CCTK_x64\HAPI\dchcfl32.dll" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86_64\HAPI\dchcfl64.dll" dest="CCTK_x64\HAPI\dchcfl64.dll" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86_64\HAPI\dchesm32.dll" dest="CCTK_x64\HAPI\dchesm32.dll" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86_64\HAPI\dchipm32.dll" dest="CCTK_x64\HAPI\dchipm32.dll" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86_64\HAPI\dchipm64.dll" dest="CCTK_x64\HAPI\dchipm64.dll" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86_64\HAPI\dchtst32.exe" dest="CCTK_x64\HAPI\dchtst32.exe" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86_64\HAPI\dchtst64.exe" dest="CCTK_x64\HAPI\dchtst64.exe" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86_64\HAPI\dchtvm32.dll" dest="CCTK_x64\HAPI\dchtvm32.dll" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86_64\HAPI\dciwds32.exe" dest="CCTK_x64\HAPI\dciwds32.exe" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86_64\HAPI\dcmdev32.exe" dest="CCTK_x64\HAPI\dcmdev32.exe" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86_64\HAPI\dcmdev64.exe" dest="CCTK_x64\HAPI\dcmdev64.exe" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86_64\HAPI\dcwipm32.dll" dest="CCTK_x64\HAPI\dcwipm32.dll" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86_64\HAPI\HAPIInstall.bat" dest="CCTK_x64\HAPI\HAPIInstall.bat" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86_64\HAPI\hapint.exe" dest="CCTK_x64\HAPI\hapint.exe" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86_64\HAPI\hapint64.exe" dest="CCTK_x64\HAPI\hapint64.exe" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86_64\HAPI\HAPIUninstall.bat" dest="CCTK_x64\HAPI\HAPIUninstall.bat" /&gt;
    &lt;Copy source="C:\Program Files (x86)\Dell\Command Configure\X86_64\HAPI\omsacntl.exe" dest="CCTK_x64\HAPI\omsacntl.exe" /&gt;

	&lt;/Content&gt;

	&lt;!-- Exits --&gt;
	&lt;Exits&gt;
	  &lt;Exit&gt;cscript.exe "%INSTALLDIR%\Samples\UpdateExit.vbs"&lt;/Exit&gt;
	&lt;/Exits&gt;

  &lt;/WindowsPE&gt;
&lt;/Definition&gt;
</code></pre>
