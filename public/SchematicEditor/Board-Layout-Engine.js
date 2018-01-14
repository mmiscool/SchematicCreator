





//detect if lines overlap
function overlap(a,b,x,y) {
    return Math.max(a,x) < Math.min(b,y)
}


//detect if boxes overlap
function boxOverlap(a,b) {
    return overlap(a.x1,a.x2,b.x1,b.x2) && overlap(a.y1,a.y2,b.y1,y.y2)
}