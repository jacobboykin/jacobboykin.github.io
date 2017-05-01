---
published: false
---
## A New Post

Enter text in [Markdown](http://daringfireball.net/projects/markdown/). Use the toolbar above, or click the **?** button for formatting help.

select SMS_R_System.Name, SMS_G_System_OPERATING_SYSTEM.Name, SMS_G_System_OPERATING_SYSTEM.BuildNumber from  SMS_R_System inner join SMS_G_System_OPERATING_SYSTEM on SMS_G_System_OPERATING_SYSTEM.ResourceID = SMS_R_System.ResourceId where SMS_G_System_OPERATING_SYSTEM.Name like "%Windows 10%" order by SMS_R_System.Name
