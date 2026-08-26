# ScalaJS engine

## Commands to know

Since your are in the `/engine` folder you can execute sbt commands.

**Warning: ** Theses commands are for sbt2 (which is different from sbt1). 

_Mandatory ones_
- run tests (with cache) `sbt test`
- run tests continuously `sbt` followed by `~test`
- run all tests `sbt testFull`
- build engine code to frontend/engine/main.js (dev purposes) `sbt fastLinkJS`
- build engine code to frontend/engine/main.js (production purposes) `sbt fullLinkJS`

_Optional ones_
- clean dependencies `sbt clean`
- compile after clean: `sbt compile`

## Debug Scala IDE integration in VSCode

Open the Command Palette (`Ctrl+Shift+P` on Windows/Linux, `⇧⌘P` on macOS):
- Metals: Import Build
- Metals: Run doctor

![alt text](image.png)