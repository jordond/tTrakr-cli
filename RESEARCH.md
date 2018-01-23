# Time simulation

# **THIS IS ASSUMING 1 MIN = 1 SECOND, ie speedFactor=30**

use `date-fns`

```javascript
import { addMilliseconds } from "date-fns";
```

Calculate speed factor

* `speedFactor` is the sped up time ie `30 => 1000ms => 1s`
* Tells you how many milliseconds is equal to a real-time minute

```javascript
minToMilliseconds(speedFactor) => 60 * 1000 / (speedFactor > 1 ? x * 2 : 1)
```

Create simulation object

```javascript
const simulatrion = { startTime: new Date(), speed: minToMilliseconds(30) };
```

Create new date object set to midnight

```javascript
const simTime = new Date();
simTime.setHours(0, 0, 0, 0);
```

Get the difference in milliseconds between the start time and the current time

```javascript
const diff = _ => new Date().getTime() - sim.startTime.getTime();
```

take the difference and scale it with the speed factor

```javascript
const rev = speedFactor => 60 * 1000 * speedFactor / (60 * 1000.0);
```

Add the adjusted difference in milliseconds to the midnight time

```javascript
addMilliseconds(simTime, diff()); // 00:02:27
```

Test the reversing algorithm

```javascript
function test(num = 30) {
  let i = num + 1;
  while (--i !== -1) {
    let c = calc(i);
    let r = rev(c);
    console.log(
      `var: ${i} -> calc: ${c}, rev: ${r} -> ${c === r ? "PASS" : "FAIL"}`
    );
  }
}
```

new

```javascript
const rTOs = x => 60000 / (x * 2 || 1);
const sTOr = x => rTOs(x) * 60 / (x > 1 ? 1 : 60);
```

convert sim milliseconds into real time
ie convert 1 minute SIM time into 1 second real time (speed factor 30)
ie convert 1 minute SIM time into 1 minute real time (speed factor 0)

```javascript
simMillisToRealMillis = (spf, millis = 60 * 1000) =>
  millis / (spf > 1 ? spf * 2 : 1);
```
