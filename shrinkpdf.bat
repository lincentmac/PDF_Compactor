@echo off
 
REM Shrinks PDFs and puts them in a subdirectory of the first file
REM Usage: shrinkpdf.bat file1 file2 ...
 
REM Location of the Ghostscript exectuble
set GSPATH="C:\Users\GIGABYTE\gs9.52\bin\gswin64c.exe"

 
if "%~1"=="" (
 echo Usage: shrinkpdf.bat inputfile outputfile resolution[optional]
 goto end
)
echo "%~1"

if "%~3" =="" (
    set RESOLUTION=72
) else (
    set RESOLUTION=%~3
)
echo %RESOLUTION%


:shrinkPDF
set OUTDIR=%~dp2
echo "%OUTDIR%"
if not exist "%OUTDIR%" mkdir "%OUTDIR%"

set OUTNAME=%OUTDIR%\%~nx2
echo "%OUTNAME%"

@echo "Processing %~nx1"
 
REM Work the shrinking magic
REM Based on http://www.alfredklomp.com/programming/shrinkpdf/
%GSPATH% -q -dNOPAUSE -dBATCH -dSAFER ^
-sDEVICE=pdfwrite ^
-dCompatibilityLevel=1.3 ^
-dPDFSETTINGS=/screen ^
-dEmbedAllFonts=true ^
-dSubsetFonts=true ^
-dColorImageDownsampleType=/Bicubic ^
-dColorImageResolution=%RESOLUTION% ^
-dGrayImageDownsampleType=/Bicubic ^
-dGrayImageResolution=%RESOLUTION% ^
-dMonoImageDownsampleType=/Bicubic ^
-dMonoImageResolution=%RESOLUTION% ^
-sOutputFile="%OUTNAME%" ^
"%~1"
 
:end