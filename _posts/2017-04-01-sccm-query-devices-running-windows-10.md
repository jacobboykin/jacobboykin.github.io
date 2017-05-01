---
published: false
layout: post
date: 2017-04-01T00:00:00.000Z
banner_image: tbd.png
tags:
  - SCCM
  - Windows
  - IT
  - Automation
  - Windows 10
  - WQL
---
<pre><code class="sql">select SMS_R_System.Name,
        SMS_G_System_OPERATING_SYSTEM.Name,
        SMS_G_System_OPERATING_SYSTEM.BuildNumber 
from  SMS_R_System inner join SMS_G_System_OPERATING_SYSTEM 
on SMS_G_System_OPERATING_SYSTEM.ResourceID = SMS_R_System.ResourceId 
where SMS_G_System_OPERATING_SYSTEM.Name like "%Windows 10%" 
order by SMS_R_System.Name</code></pre>