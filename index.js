const canvas = document.getElementById('animationCanvas');
const ctx = canvas.getContext('2d');

// position of the animation in the canvas
const centerX = canvas.width / 2; // 400
const centerY = canvas.height +26; // 190

// radius of the animation in canvas
const radiusX = canvas.width / 2 - 200; // 300
const radiusY = canvas.height * 0.2; // 40

// fixed dot data
const fixedDots = [
    { label: 'A', angle: Math.PI / 1.2, glowing: false },
    { label: 'B', angle: Math.PI / 2, glowing: false },
    { label: 'C', angle: Math.PI / 6, glowing: false }
];

// oscillating blue dot
let oscillatingDot = { angle: Math.PI / 2, direction: -1 };
let oscillatingSpeed = 0.03;
let stoppedTime = 0;
let targetAngle = null;
let returningToGlowingDot = false;

// Get the minimum and maximum angles from fixed dots A and C
const minAngle = Math.min(fixedDots[0].angle, fixedDots[2].angle);
const maxAngle = Math.max(fixedDots[0].angle, fixedDots[2].angle);

// drawing dot
function drawDot(x, y, color, label) {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.font = "16px sans-serif";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText(label, x, y - 10);
}

function update() {
    // clears the previous frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw wide and flat semi-circle
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, Math.PI, 0);
    ctx.stroke();

    // Draw fixed dots
    fixedDots.forEach(dot => {
        const x = centerX + Math.cos(dot.angle) * radiusX;
        const y = centerY - Math.sin(dot.angle) * radiusY;
        drawDot(x, y, dot.glowing ? 'yellow' : 'red', dot.label);
    });

    // Update and draw oscillating dot
    if (returningToGlowingDot) {
        // Move toward the glowing dot if passed
        const angleDiff = targetAngle - oscillatingDot.angle;
        if (Math.abs(angleDiff) < oscillatingSpeed) {
            oscillatingDot.angle = targetAngle;
            returningToGlowingDot = false;
            stoppedTime = 60;
            targetAngle = null;
        } else {
            oscillatingDot.angle += Math.sign(angleDiff) * oscillatingSpeed;
        }
    } else if (stoppedTime > 0) {
        stoppedTime--;
    } else {
        oscillatingDot.angle += oscillatingSpeed * oscillatingDot.direction;
        // When the dot reaches the end points (A or C), it reverses direction
        if (oscillatingDot.angle <= minAngle || oscillatingDot.angle >= maxAngle) {
            oscillatingDot.direction *= -1;
            oscillatingDot.angle = Math.max(minAngle, Math.min(maxAngle, oscillatingDot.angle));
            // If a glowing dot exists, return to it
            if (targetAngle !== null) {
                returningToGlowingDot = true;
            }
        }
    }

    const oscX = centerX + Math.cos(oscillatingDot.angle) * radiusX;
    const oscY = centerY - Math.sin(oscillatingDot.angle) * radiusY;
    drawDot(oscX, oscY, 'blue', '');

    // Randomly glow fixed dots
    if (Math.random() < 0.005 && targetAngle === null && stoppedTime === 0) {
        const randomDot = fixedDots[Math.floor(Math.random() * fixedDots.length)];
        randomDot.glowing = true;
        targetAngle = randomDot.angle;
    } else if (stoppedTime === 0) {
        fixedDots.forEach(dot => dot.glowing = false);
    }

    requestAnimationFrame(update);
}

update();