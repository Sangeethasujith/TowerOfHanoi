$(document).ready(function() {
    var towers = [[[], $(".line1")], [[], $(".line2")], [[], $(".line3")]],
        moves = 0,
        discs = null,
        hold = null,
        moveSequence = [],
        moveIndex = 0;

    function clear() {
        towers.forEach(tower => tower[1].empty());
    }

    function drawDiscs() {
        clear();
        towers.forEach(tower => {
            if (!jQuery.isEmptyObject(tower[0])) {
                tower[0].forEach((disk, index) => {
                    var diskElement = $("<li id='disc" + disk + "' value='" + disk + "'></li>").css({
                        "width": 30 + disk * 20 + "px",
                        "margin-bottom": (index * 25) + "px" // Adjust for separation
                    });
                    tower[1].append(diskElement);
                });
            }
        });
    }

    function init() {
        clear();
        towers = [[[], $(".line1")], [[], $(".line2")], [[], $(".line3")]];
        discs = parseInt($("#box").val());
        moves = 0;
        hold = null;
        moveSequence = [];
        moveIndex = 0;
        for (var i = discs; i > 0; i--) towers[0][0].push(i);
        drawDiscs();
        $(".moves").text(moves + " moves");
    }

    function handle(tower) {
        if (hold === null) {
            if (!jQuery.isEmptyObject(towers[tower][0])) {
                hold = tower;
                towers[hold][1].children().last().css("margin-bottom", "-25px");
            }
        } else {
            var move = moveDisc(hold, tower);
            moves += 1;
            $(".moves").text(moves + " moves");
            if (move == 1) {
                drawDiscs();
            } else {
                alert("You can't place a bigger disc on a smaller one");
            }
            hold = null;
        }
        if (solved()) $(".moves").text("Solved with " + moves + " moves!");
    }

    function moveDisc(a, b) {
        var from = towers[a][0];
        var to = towers[b][0];
        if (from.length === 0) return 0;
        else if (to.length === 0) {
            to.push(from.pop());
            return 1;
        } else if (from[from.length - 1] > to[to.length - 1]) {
            return 0;
        } else {
            to.push(from.pop());
            return 1;
        }
    }

    function solved() {
        return jQuery.isEmptyObject(towers[0][0]) && jQuery.isEmptyObject(towers[1][0]) && towers[2][0].length == discs;
    }

    function solveHanoi(n, from, to, aux) {
        if (n > 0) {
            solveHanoi(n - 1, from, aux, to);
            moveSequence.push({ from: from, to: to });
            solveHanoi(n - 1, aux, to, from);
        }
    }

    function animateSolution() {
        if (moveIndex < moveSequence.length) {
            var move = moveSequence[moveIndex];
            moveDisc(move.from, move.to);
            drawDiscs();
            moveIndex++;
            $(".moves").text(moveIndex + " moves");
            setTimeout(animateSolution, 500);
        } else {
            if (solved()) $(".moves").text("Solved with " + moveIndex + " moves!");
        }
    }

    $("#solve").click(function() {
        solveHanoi(discs, 0, 2, 1);
        animateSolution();
    });

    $(".t").click(function() {
        handle($(this).attr("value"));
    });

    $("#restart").click(function() {
        init();
    });

    init();
});
