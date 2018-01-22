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
minToMilliseconds(speedFactor) => 60 * 1000 / (speedFactor >= 2 ? x * 2 : 1)
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

Add the difference in milliseconds to the midnight time

```javascript
addMilliseconds(simTime, diff()); // 00:02:27
```
