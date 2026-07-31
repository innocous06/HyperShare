@echo off
title HyperShare Server
echo Starting HyperShare...
cd /d "%~dp0"
node server.js
pause
