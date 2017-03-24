---
layout: post
title: Part I - Writing Reliable PowerShell Scripts
date: 2017-03-02
banner_image: reliable-powershell.png
tags: [PowerShell, Windows, IT, Automation]
---

Automating tasks with PowerShell is awesome - but when you begin to automate more complex tasks that run on production servers, it's important that your PowerShell scripts do what you expect them to. And if they don't, they should handle themselves appropriately. In this series, I'll be discussing a few simple, yet powerful ways to enhance your PowerShell scripts' reliability and error-handling capabilities.

{% include image_caption.html imageurl="https://raw.githubusercontent.com/jacobboykin/100-days-of-code/master/img/day_7.gif" title="Kermit Hacking" %}

We'll be improving upon a basic script set to run via Task Scheduler each month on a file server that updates a local Office 365 deployment share. We'll start with the just the essential tasks and make some important adjustments to make this script rock-solid. Here's our initial code, containing only the bare-minimum tasks that need to be completed:

<pre><code class="powershell"># Point to the setup.exe and specify arguments
$setupEXE = "D:\Apps\Office-365\Source\setup.exe"
$arguments = "/download D:\Apps\Office-365\Source\Download.xml"

# Delete current office source if it exists
if (Test-Path "D:\Apps\Office-365\Source\Office") {
  Remove-Item "D:\Apps\Office-365\Source\Office" -Recurse -Force
}

# Run setup.exe in download mode and wait for it to finish
Start-Process -FilePath $setupEXE -ArgumentList $arguments -Wait</code></pre>

If you're not familiar with Office 365 Click-to-run deployment this might look a bit weird, but for the purposes of this demonstration this is all we're trying to do:
1. Check if a folder exists
2. Delete that folder if it exists
3. Start a setup.exe application that will download the latest Office 365 deferred channel source files

Now, this works just fine - but this needs to run **unattended**, on a **schedule** and on a **production** file server. Our Windows machines depend on this file share to update their Office installations. If any errors occur during the script's execution, we have almost no insight into what happened. We can make a few simple adjustments to give ourselves some insights into this tasks' performance and give us some peace of mind.

## Start-Transcript
We'll begin by adding some logging functionality to our script. [**Start-Transcript**](https://msdn.microsoft.com/en-us/powershell/reference/5.1/microsoft.powershell.host/start-transcript) is a handy cmdlet that will log the console output of a PowerShell session. This means that any errors, console logs/writes or user input will be logged to a nice little file that includes some cool details about the session. In this case, I disabled my network connection, causing setup.exe to throw an error since it couldn't reach Microsoft's server's to download Office. Check it out!

```
**********************
Windows PowerShell transcript start
Start time: 20170322231105
Username: COMPUTERNAME\jacob
RunAs User: COMPUTERNAME\jacob
Machine: COMPUTERNAME (Microsoft Windows NT 10.0.14393.0)
Host Application: C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe
Process ID: 12376
PSVersion: 5.1.14393.953
PSEdition: Desktop
PSCompatibleVersions: 1.0, 2.0, 3.0, 4.0, 5.0, 5.1.14393.953
BuildVersion: 10.0.14393.953
CLRVersion: 4.0.30319.42000
WSManStackVersion: 3.0
PSRemotingProtocolVersion: 2.3
SerializationVersion: 1.1.0.1
**********************
Transcript started, output file is D:\Apps\office-365\updateScript.log

Checking if Office source folder exists...

Running command: D:\Apps\Office-365\Source\setup.exe /download D:\Apps\Office-365\Source\Download.xml

setup.exe exited with code -2147418113
**********************
Windows PowerShell transcript end
End time: 20170322231114
**********************
```

And here's our updated code that made this happen:

<pre><code class="powershell">Start-Transcript -Path D:\Apps\office-365\updateScript.log -Verbose -Force

# Point to the setup.exe and specifiy arguments
$setupEXE = "D:\Apps\Office-365\Source\setup.exe"
$arguments = "/download D:\Apps\Office-365\Source\Download.xml"

# Delete current Office source if it exists
$officeSourceDir = "D:\Apps\Office-365\Source\Office"
Write-Host "`nChecking if Office source folder exists..."
if (Test-Path $officeSourceDir) {
  Write-Host "`nOffice source exists at $officeSourceDir. Will delete folder..."
  Remove-Item $officeSourceDir -Recurse -Force
}

# Run setup.exe in download mode and wait for it to finish
Write-Host "`nRunning command: $setupEXE $arguments"
$exitCode = (Start-Process -FilePath $setupEXE -ArgumentList $arguments -Wait -PassThru).ExitCode
Write-Host "`nsetup.exe exited with code $exitCode"

Stop-Transcript</code></pre>

Let's go over what we've added here. We can start logging to a file whenever we want. In this case, we want to start logging immediately so we start off with the Start-Transcript cmdlet telling it where to write and to overwrite the file if it may already exist.

<pre><code class="powershell">Start-Transcript -Path D:\Apps\office-365\updateScript.log -Verbose -Force</code></pre>

I've also added a few **Write-Host** cmdlets to log info about what the script is doing to the console and thus the log file. Note that I'm using the newline character at the beginning of each line (**`n**). Without this the log file would just be one long messy string.

<pre><code class="powershell">Write-Host "`nRunning command: $setupEXE $arguments"</code></pre>

I also added the collection of Start-Process cmdlet's return data, grabbing the exit code of setup.exe. As with most applications, if this is anything but 0, something probably went wrong. Remember to check the documentation of cmdlets and to play with the data they return. This is just a basic example, but cool stuff like this can be super helpful in creating an effective log file.

<pre><code class="powershell">$exitCode = (Start-Process -FilePath $setupEXE -ArgumentList $arguments -Wait -PassThru).ExitCode
Write-Host "`nsetup.exe exited with code $exitCode"</code></pre>

Finally, we need to tell PowerShell when to stop logging our session with the **Stop-Transcript** cmdlet. Check out the PowerShell documentation on these cmdlets for more info:

[Start-Transcript](https://msdn.microsoft.com/en-us/powershell/reference/5.1/microsoft.powershell.host/start-transcript)

[Stop-Transcript](https://msdn.microsoft.com/en-us/powershell/reference/5.1/microsoft.powershell.host/stop-transcript)

## Error Action Preference

During execution, PowerShell will throw terminating and non-terminating errors. Terminating errors will halt script execution completely and are typically caused by syntax errors. Non-terminating errors are not as serious and will allow execution to continue. Examples of non-terminating errors might include permissions or network connectivity issues. PowerShell actually lets us control the behavior for non-terminating errors using Error Action Preference.

In our script I've added a new line just after **Start-Transcript** which will cause PowerShell to write any non-terminating error to the console (the updateScript.log in our case) and stop execution.

<pre><code class="powershell">Start-Transcript -Path D:\Apps\office-365\updateScript.log -Verbose -Force

$ErrorActionPreference = "Stop"

# Point to the setup.exe and specifiy arguments

...</code></pre>

Pretty simple! There are other values we can assign to this variable as well. PowerShell's documentation explains them succinctly:

>Stop: Displays the error message and stops executing.
>
>Inquire: Displays the error message and asks you whether you want to continue.
>
>Continue: Displays the error message and continues (Default) executing.
>
>Suspend: Automatically suspends a workflow job to allow for further investigation. After investigation, the workflow can be resumed.
>
>SilentlyContinue: No effect. The error message is not displayed and execution continues without interruption.

While this is cool, there are even more powerful ways for us to handle errors. Get ready for control flow altering Try / Catch statements!

[About Preference Variables (ErrorActionPreference)](https://msdn.microsoft.com/en-us/powershell/reference/5.1/microsoft.powershell.core/about/about_preference_variables)

## Try / Catch / Finally

<pre><code>Start-Transcript -Path D:\Apps\office-365\updateScript.log -Verbose -Force

try {
    $ErrorActionPreference = "Stop"

    # Point to the setup.exe and specifiy arguments
    $setupEXE = "D:\Apps\Office-365\Source\setup.exe"
    $arguments = "/download D:\Apps\Office-365\Source\Download.xml"

    # Delete current Office source if it exists
    $officeSourceDir = "D:\Apps\Office-365\Source\Office"
    Write-Host "`nChecking if Office source folder exists..."
    if (Test-Path $officeSourceDir) {
      Write-Host "`nOffice source exists at $officeSourceDir. Will delete folder..."
      Remove-Item $officeSourceDir -Recurse -Force
    }

    # Run setup.exe in download mode and wait for it to finish
    Write-Host "`nRunning command: $setupEXE $arguments"
    $exitCode = (Start-Process -FilePath $setupEXE -ArgumentList $arguments -Wait -PassThru).ExitCode
    Write-Host "`nsetup.exe exited with code $exitCode"
    }
catch {

}
finally {
    Stop-Transcript
}
</code></pre>
