function Get-CommandList {
    param(
        $Path,
        [Switch]
        $Save
    )

    if ($Path.length -gt 0) {
        $FileContent = (Get-Content -Path $Path) -match '.*registerSubcommand|.*registerCommand'
    }
    else {
        $FileContent = (Get-Content -Path .\Tron.js) -match '.*registerSubcommand|.*registerCommand' | ForEach-Object { $_.substring(0, $_.indexOf(','))}
    }

    if ($Save.IsPresent) {
        Out-File -FilePath .\Commands.txt -InputObject $FileContent
    }

    Write-Output $FileContent
}