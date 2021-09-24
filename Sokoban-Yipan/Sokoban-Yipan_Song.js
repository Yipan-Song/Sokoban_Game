"use strict";

function getLevel() {
    document.getElementById("Map").innerHTML = null; // to clear the previous map when the level is reset, otherwise the the previous will exist and affect the game
    level = document.getElementById("levels").value; // get the value of the player's option
    levelArray = JSON.parse(JSON.stringify(allLevels[level])); // get the map array according to the level
    grade = 0; // clear the grade because the game restart
    goalNum = 0; // clear the number of goals
    stepArray = [];
    boxArray = [];
    step = 0;
    push = 0;
    document.getElementById("step").innerHTML = "You have moved " + step + " steps";
    document.getElementById("push").innerHTML = "You have pushed " + push + " times";
    getMap(); // call the map function to get the new map
}
function getMap () {
    for (var x in levelArray) { // for each row
        for (var y in levelArray[x]) { // for each cell of the row
            var cell = document.createElement("div"); // create the tag 'div'
            $(cell).attr("id", "id" + x + "_" + y); // add the id to each cell. using x and y to be the id is to make every of the cell to be different and easy to distinguish
            $(cell).css({ // set the css to every cell which is the element in the map
                "width": "50px",
                "height": "50px",
                "position": "absolute",
                "left": y * 50 + "px",
                "top": x * 50 + "px",
                "text-align": "center",
                "background-repeat": "no-repeat",
                "background-size": "cover"
            });
            var element = levelArray[x][y];
            if (element == "W") { // set different picture to the corresponding element in the map (the wall, the box, the goal, the road and the black background)
                $(cell).css("background-image", "url(image/wall.jpg)"); // the "W" represents the wall picture
            } else if (element == "R") {
                $(cell).css("background-image", "url(image/road.jpg)"); // the "R" represents the road picture
            } else if (element == "G") {
                $(cell).css("background-image", "url(image/goal.jpg)"); // the "G" represents the goal picture
                goalNum++; // check the number of the goals
            } else if (element == "N") {
                $(cell).css("background-image", "url(image/black.jpg)"); // the "N" represents the black background picture
            } else {
                $(cell).css("background-image", "url(image/box.jpg)"); // the "B" represents the box picture
            }
            $(cell).appendTo($("#Map")); // make every cell to be appended to the whole map
        }
    }
    n = 4; // the original horizontal ordinate of the man (player)
    m = 3; // the original longitudinal coordinates of the man (player)
    $(man).css({ // set the css to the man
        "width": "50px",
        "height": "50px",
        "position": "absolute",
        "left": n * 50 + "px",
        "top": m * 50 + "px",
        "background-image": "url(image/player.png)",
        "text-align": "center",
        "background-repeat": "no-repeat",
        "background-size": "cover"
    });
    $(man).appendTo($("#Map")); // add the man to the map
}
document.onkeydown = function() {
    key = event.keyCode;  // the code of the key that players tapped
    if (key == 37) { // when players tap the left key
        $(man).css("background-image", "url(image/left.png)"); // change the man picture to the man picture which is going left
        if (levelArray[m][n - 1] == "B" || levelArray[m][n - 1] == "BG") { // when the left of the man is box or box in goal
            if (levelArray[m][n - 2] != "W" && levelArray[m][n - 2] != "B" && levelArray[m][n - 2] != "BG") { // when the left left side of the man is not box or wall, only in this case the man can move to the left, otherwise he will be stopped
                boxArray.push(1); // in this case the man will push the box to the left, so the box is moved, add '1' to the array to let the retreat function know 'in this step the box is moved', so that when the retreat function is called, the box will be moved back
                stepArray.push(key); // in this case, the man can moved, so add the code of the key to the array to let the retreat function know the direction that the man moved
                n--; // change the horizontal ordinate to let the man move to the left for a step
                step++; // the moving step plus one
                push++; // the push times plus one
                document.getElementById("step").innerHTML = "You have moved " + step + " steps";
                document.getElementById("push").innerHTML = "You have pushed " + push + " times";
                if (levelArray[m][n - 1] == "G" && levelArray[m][n] == "B") { // in this case the left left of the man(when he doesn"t start to move) os goal and the left of him is a box, so when he moves to left, he will push the box into the goal
                    boxAudio.play(); // play the audio effect which represents the box moved into the goal
                    document.getElementById("id" + m + "_" + n).style.backgroundImage = "url(image/road.jpg)"; // change the box picture in the place that the box original exist to the road picture
                    document.getElementById("id" + m + "_" + (n - 1)).style.backgroundImage = "url(image/boxGoal.jpg)"; // change the picture(goal) that left the the original box to the boxGoal picture (boxGoal pixture is more bright than the box picture, which can better represent that the player pushed the box in the goal successfully)
                    levelArray[m][n] = "R"; // change the corresponding cell(element) in the array ( change the "B" to "R"), because the pictures in the map are changed
                    levelArray[m][n - 1] = "BG";  // change the corresponding cell(element) in the array ( change the "G" to "BG") ("BG" represents that the box is pushed into the goal), because the pictures in the map are changed
                    grade++; // grades plus one because player pushed the box into the goal
                } else if (levelArray[m][n - 1] == "G" && levelArray[m][n] == "BG") { // in this case, the left left of the man is the goal and the left of the man is the box which is also in the goal
                    boxAudio.play();
                    document.getElementById("id" + m + "_" + n).style.backgroundImage = "url(image/goal.jpg)"; //change picture of the left of the man to the goal, because the box is moved
                    document.getElementById("id" + m + "_" + (n - 1)).style.backgroundImage = "url(image/boxGoal.jpg)"; // change the picture of the left left of the man to the boxGoal, because the box is moved into the goal
                    levelArray[m][n] = "G"; // change the corresponding cell(element) in the array ( change the "BG" to "G"), because the pictures in the map are changed
                    levelArray[m][n - 1] = "BG"; // change the corresponding cell(element) in the array ( change the "G" to "BG")
                } else if (levelArray[m][n - 1] == "R" && levelArray[m][n] == "B") { // in this case the left left of the man is road and the left of the man is box which is not in the goal
                    stepAudio.play(); // play the audio which represents the man has walked but not moved the box to the goal
                    document.getElementById("id" + m + "_" + n).style.backgroundImage = "url(image/road.jpg)"; //change the picture of left of the man to the road
                    document.getElementById("id" + m + "_" + (n - 1)).style.backgroundImage = "url(image/box.jpg)"; // change the picture of the left left of the man to the box
                    levelArray[m][n] = "R"; // change the corresponding cell(element) in the array ( change the "B" to "R")
                    levelArray[m][n - 1] = "B"; // change the corresponding cell(element) in the array ( change the "R" to "B")
                } else { // in this case the left of the man is the box which is in the goal and the left left of the man is the road
                    stepAudio.play();
                    document.getElementById("id" + m + "_" + n).style.backgroundImage = "url(image/goal.jpg)";
                    document.getElementById("id" + m + "_" + (n - 1)).style.backgroundImage = "url(image/box.jpg)";
                    levelArray[m][n] = "G";
                    levelArray[m][n - 1] = "B";
                    grade--; // the player move the box out of the goal to the road, so the grades are reduced
                }
                $(man).css("left", n * 50 + "px"); // the horizontal ordinate of the man is changed, so the man picture is moved according to the horizontal ordinate
            } else { // in this case, the man can not move, because the left and left left of the man are both the boxes or the box and the wall
                stopAudio.play(); // play the stop audio
            }
        } else if (levelArray[m][n - 1] == "R" || levelArray[m][n - 1] == "G") { // in this case the left of the man is road or the goal
            stepAudio.play();
            boxArray.push(0); // there is no box moved, add zero to the array to let the retreat function know in this step there is no box should be moved back
            stepArray.push(key); // add the key code to the stepArray let the retreat function know the direction that the man moved
            n--; // change the horizontal ordinate of the man
            step++; // the step plus one
            document.getElementById("step").innerHTML = "You have moved " + step + " steps";
            $(man).css("left", n * 50 + "px");
        } else { //in this case, the left of the man is the wall, he can't move
            stopAudio.play();
        }
    } else if (key == 38) { // in this case players tap the up key
        $(man).css("background-image", "url(image/up.png)");
        if (levelArray[m - 1][n] == "B" || levelArray[m - 1][n] == "BG") {
            if (levelArray[m - 2][n] != "W" && levelArray[m - 2][n] != "B" && levelArray[m - 2][n] != "BG") {
                boxArray.push(1);
                stepArray.push(key);
                step++;
                push++;
                m--;
                document.getElementById("step").innerHTML = "You have moved " + step + " steps";
                document.getElementById("push").innerHTML = "You have pushed " + push + " times";
                if (levelArray[m - 1][n] == "G" && levelArray[m][n] == "B") {
                    boxAudio.play();
                    document.getElementById("id" + m + "_" + n).style.backgroundImage = "url(image/road.jpg)";
                    document.getElementById("id" + (m - 1) + "_" + n).style.backgroundImage = "url(image/boxGoal.jpg)";
                    levelArray[m][n] = "R";
                    levelArray[m - 1][n] = "BG";
                    grade++;
                } else if (levelArray[m - 1][n] == "G" && levelArray[m][n] == "BG") {
                    boxAudio.play();
                    document.getElementById("id" + m + "_" + n).style.backgroundImage = "url(image/goal.jpg)";
                    document.getElementById("id" + (m - 1) + "_" + n).style.backgroundImage = "url(image/boxGoal.jpg)";
                    levelArray[m][n] = "G";
                    levelArray[m - 1][n] = "BG";
                } else if (levelArray[m - 1][n] == "R" && levelArray[m][n] == "B") {
                    stepAudio.play();
                    document.getElementById('id' + m + '_' + n).style.backgroundImage = "url(image/road.jpg)";
                    document.getElementById('id' + (m - 1) + '_' + n).style.backgroundImage = "url(image/box.jpg)";
                    levelArray[m][n] = "R";
                    levelArray[m - 1][n] = "B";
                } else {
                    stepAudio.play();
                    document.getElementById("id" + m + "_" + n).style.backgroundImage = "url(image/goal.jpg)";
                    document.getElementById("id" + (m - 1) + "_" + n).style.backgroundImage = "url(image/box.jpg)";
                    levelArray[m][n] = "G";
                    levelArray[m - 1][n] = "B";
                    grade--;
                }
                $(man).css("top", m * 50 + "px");
            } else {
                stopAudio.play();
            }
        } else if (levelArray[m - 1][n] == "R" || levelArray[m - 1][n] == "G") {
            stepAudio.play();
            boxArray.push(0);
            stepArray.push(key);
            m--;
            step++;
            document.getElementById("step").innerHTML = "You have moved " + step + " steps";
            $(man).css("top", m * 50 + "px");
        } else {
            stopAudio.play();
        }
    } else if (key == 40) { // in this case, players tap the down key
        $(man).css("background-image", "url(image/player.png)");
        if (levelArray[m + 1][n] == "B" || levelArray[m + 1][n] == "BG") {
            if (levelArray[m + 2][n] != "W" && levelArray[m + 2][n] != "B" && levelArray[m + 2][n] != "BG") {
                boxArray.push(1);
                stepArray.push(key);
                step++;
                push++;
                m++;
                document.getElementById("step").innerHTML = "You have moved " + step + " steps";
                document.getElementById("push").innerHTML = "You have pushed " + push + " times";
                if (levelArray[m + 1][n] == "G" && levelArray[m][n] == "B") {
                    boxAudio.play();
                    document.getElementById("id" + m + "_" + n).style.backgroundImage = "url(image/road.jpg)";
                    document.getElementById("id" + (m + 1) + "_" + n).style.backgroundImage = "url(image/boxGoal.jpg)";
                    levelArray[m][n] = "R";
                    levelArray[m + 1][n] = "BG";
                    grade++;
                } else if (levelArray[m + 1][n] == "G" && levelArray[m][n] == "BG") {
                    boxAudio.play();
                    document.getElementById("id" + m + "_" + n).style.backgroundImage = "url(image/goal.jpg)";
                    document.getElementById("id" + (m + 1) + "_" + n).style.backgroundImage = "url(image/boxGoal.jpg)";
                    levelArray[m][n] = "G";
                    levelArray[m + 1][n] = "BG";
                } else if (levelArray[m + 1][n] == "R" && levelArray[m][n] == "B") {
                    stepAudio.play();
                    document.getElementById("id" + m + "_" + n).style.backgroundImage = "url(image/road.jpg)";
                    document.getElementById("id" + (m + 1) + "_" + n).style.backgroundImage = "url(image/box.jpg)";
                    levelArray[m][n] = "R";
                    levelArray[m + 1][n] = "B";
                } else {
                    stepAudio.play();
                    document.getElementById("id" + m + "_" + n).style.backgroundImage = "url(image/goal.jpg)";
                    document.getElementById("id" + (m + 1) + "_" + n).style.backgroundImage = "url(image/box.jpg)";
                    levelArray[m][n] = "G";
                    levelArray[m + 1][n] = "B";
                    grade--;
                }
                $(man).css("top", m * 50 + "px");
            } else {
                stopAudio.play();
            }
        } else if (levelArray[m + 1][n] == "R" || levelArray[m + 1][n] == "G") {
            stepAudio.play();
            boxArray.push(0);
            stepArray.push(key);
            m++;
            step++;
            document.getElementById("step").innerHTML = "You have moved " + step + " steps";
            $(man).css("top", m * 50 + "px");
        } else {
            stopAudio.play();
        }
    } else if (key == 39) {// in this case players tap the right key
        $(man).css("background-image", "url(image/right.png)");
        if (levelArray[m][n + 1] == "B" || levelArray[m][n + 1] == "BG") {
            if (levelArray[m][n + 2] != "W" && levelArray[m][n + 2] != "B" && levelArray[m][n + 2] != "BG") {
                boxArray.push(1);
                stepArray.push(key);
                step++;
                push++;
                n++;
                document.getElementById("step").innerHTML = "You have moved " + step + " steps";
                document.getElementById("push").innerHTML = "You have pushed " + push + " times";
                if (levelArray[m][n + 1] == "G" && levelArray[m][n] == "B") {
                    boxAudio.play();
                    document.getElementById("id" + m + "_" + n).style.backgroundImage = "url(image/road.jpg)";
                    document.getElementById("id" + m + "_" + (n + 1)).style.backgroundImage = "url(image/boxGoal.jpg)";
                    levelArray[m][n] = "R";
                    levelArray[m][n + 1] = "BG";
                    grade++;
                } else if (levelArray[m][n + 1] == "G" && levelArray[m][n] == "BG") {
                    boxAudio.play();
                    document.getElementById("id" + m + "_" + n).style.backgroundImage = "url(image/goal.jpg)";
                    document.getElementById("id" + m + "_" + (n + 1)).style.backgroundImage = "url(image/boxGoal.jpg)";
                    levelArray[m][n] = "G";
                    levelArray[m][n + 1] = "BG";
                } else if (levelArray[m][n + 1] == "R" && levelArray[m][n] == "B") {
                    stepAudio.play();
                    document.getElementById("id" + m + "_" + n).style.backgroundImage = "url(image/road.jpg)";
                    document.getElementById("id" + m + "_" + (n + 1)).style.backgroundImage = "url(image/box.jpg)";
                    levelArray[m][n] = "R";
                    levelArray[m][n + 1] = "B";
                } else {
                    stepAudio.play();
                    document.getElementById("id" + m + "_" + n).style.backgroundImage = "url(image/goal.jpg)";
                    document.getElementById("id" + m + "_" + (n + 1)).style.backgroundImage = "url(image/box.jpg)";
                    levelArray[m][n] = "G";
                    levelArray[m][n + 1] = "B";
                    grade--;
                }
                $(man).css("left", n * 50 + "px");
            } else {
                stopAudio.play();
            }
        } else if (levelArray[m][n + 1] == "R" || levelArray[m][n + 1] == "G") {
            stepAudio.play();
            boxArray.push(0);
            stepArray.push(key);
            n++;
            step++;
            document.getElementById("step").innerHTML = "You have moved " + step + " steps";
            $(man).css("left", n * 50 + "px");
        } else {
            stopAudio.play();
        }
    }
    if (grade == goalNum) { // check if the player move all the boxes into the goal
        if (level < 4) { // the game has 5 levels, and in the JS, level is begin as 0 (it is set as 0 at the beginning), so the level<4 means the level of the game<5
            $('#levels').attr("disabled", true); // when the alert appears, disable the 'level' selection key
            $('#retreat').attr("disabled", true); // when the alert appears, disable the 'retreat' button
            $('#reset').attr("disabled", true); // when the alert appears, disable the 'reset' button
            $('#retreat').css('background-color', 'grey'); // when the alert appears, make the 'retreat' button to be gray
            $('#reset').css('background-color', 'grey'); // when the alert appears, make the 'reset' button to be gray
            winAudio.play(); // play the win audio
            alert.style.display = "block"; // make the alert to appear
        } else { // when the player wins the fifth level, the content hint or the alert is different from the previous ones
            $('#levels').attr("disabled", true);
            $('#retreat').attr("disabled", true);
            $('#reset').attr("disabled", true);
            $('#retreat').css('background-color', 'grey');
            $('#reset').css('background-color', 'grey');
            winAudio.play();
            end.style.display = "block"; // make the the other alert to appear(the content in it is different from the previous levels)
        }
    }
}
function getCancel() { // when the player clicks the 'No' button on the alert, this function will be called, then the map will be reset (the level is not changed)
    $('#levels').attr("disabled",false); // the 'level' selection key  can be used again
    $('#retreat').attr("disabled",false); // the 'retreat' button  can be used again
    $('#reset').attr("disabled",false); //the 'reset' button  can be used again
    $('#retreat').css('background-color', 'ForestGreen'); // the 'retreat' button is set as 'ForestGreen' background again
    $('#reset').css('background-color', 'ForestGreen');
    stepAudio.play();
    alert.style.display="none"; // make the alert disappear
    document.getElementById("Map").innerHTML = null; // clear the map which players has already won
    getLevel(); //  the getLevel function(in the getLevel function, the level is not changed, and in it the getMap function can be called, then a new map will appear, the level of the map is the same as the previous)
}
function getConfirm() { // when the player clicks the 'Yes' button, this function will be called, then player will enter the next level
    $('#levels').attr("disabled",false);
    $('#retreat').attr("disabled",false);
    $('#reset').attr("disabled",false);
    $('#retreat').css('background-color', 'ForestGreen');
    $('#reset').css('background-color', 'ForestGreen');
    stepAudio.play();
    alert.style.display="none";
    document.getElementById("Map").innerHTML = null;
    level++; // the player choose to enter the next level so the level plus one
    $("#levels").val(level); // change the value of the option in the selection (plus one)
    getLevel();
}
function getFifth() { // when the player clicks the 'Yes' button on the fifth level alert, this function will be called
    $('#levels').attr("disabled",false);
    $('#retreat').attr("disabled",false);
    $('#reset').attr("disabled",false);
    $('#retreat').css('background-color', 'ForestGreen');
    $('#reset').css('background-color', 'ForestGreen');
    stepAudio.play();
    end.style.display="none";
    document.getElementById("Map").innerHTML = null;
    getLevel();
}
function getFirst() { // when the player clicks the 'Yes' button, this function will be called, then player will enter the first level
    $('#levels').attr("disabled",false);
    $('#retreat').attr("disabled",false);
    $('#reset').attr("disabled",false);
    $('#retreat').css('background-color', 'ForestGreen');
    $('#reset').css('background-color', 'ForestGreen');
    stepAudio.play();
    end.style.display="none";
    document.getElementById("Map").innerHTML = null;
    level = 0; // change the level to be 0 (the level of the game is changed to be the first)
    $("#levels").val(level);
    getLevel();
}
function getRetreat() { // to retreat the step
    if (step < 1) { // when the number of step is lower than 1, it will be set as 1 to prevent the number of step being lower than 0, because there is 'step--'in the next
        step = 1;
        $(man).css("background-image", "url(image/player.png)"); // when player retreat the man to return the beginning status, the picture of the man should be changed to be original
    }
    var i = stepArray.length - 1; // the order number of the last element in the array is 'array.length - 1'
    var j = boxArray.length - 1;
    var checkKey = stepArray[i]; // get the last element of the stepArray to let the function know which is the last direction that the man moved so that it can retreat it
    var checkBox = boxArray[j]; // get the last element of the stepArray to let the function know in the last step if the box is moved or not ('1' is moved, '0' is not moved)
    step--; // when the player retreat the man, the number of steps  minus one
    document.getElementById("step").innerHTML = "You have moved " + step + " steps";
    if (checkKey == 37) { // when the last step is moving to the left
        $(man).css("background-image", "url(image/right.png)");
        if (checkBox == 1) { // in this case, in the last step the box is moved
            if (levelArray[m][n - 1] == "B") { // in this case, the left of the man is a box which is not in the goal
                push--; // the number of push minus one
                document.getElementById("push").innerHTML = "You have pushed " + push + " times";
                if (levelArray[m][n] != "G") {  // in this case, the man is not in the goal
                    stepAudio.play();
                    document.getElementById("id" + m + "_" + n).style.backgroundImage = "url(image/box.jpg)"; // the picture of the man is changed to be the box
                    document.getElementById("id" + m + "_" + (n - 1)).style.backgroundImage = "url(image/road.jpg)"; // the picture of the box is changed to be the road
                    levelArray[m][n] = "B"; // change the element of the "R" to be "B" in the array
                    levelArray[m][n - 1] = "R"; // change the element of the "B" to be "R"
                } else { // in this case, the man is in the goal, so when the player retreats, the box is moved back to the goal
                    boxAudio.play(); // play the 'box moved to the goal' audio
                    document.getElementById("id" + m + "_" + n).style.backgroundImage = "url(image/boxGoal.jpg)";
                    document.getElementById("id" + m + "_" + (n - 1)).style.backgroundImage = "url(image/road.jpg)";
                    levelArray[m][n] = "BG";
                    levelArray[m][n - 1] = "R";
                    grade++; // the grades plus one because the box is moved to the goal
                }
            } else if (levelArray[m][n - 1] == "BG") {  // in this case, the left of the man is a box which is the goal
                push--;
                document.getElementById("push").innerHTML = "You have pushed " + push + " times";
                if (levelArray[m][n] != "G") { // the man is not in the goal
                    stepAudio.play();
                    document.getElementById("id" + m + "_" + n).style.backgroundImage = "url(image/box.jpg)";
                    document.getElementById("id" + m + "_" + (n - 1)).style.backgroundImage = "url(image/goal.jpg)";
                    levelArray[m][n] = "B";
                    levelArray[m][n - 1] = "G";
                    grade--; // the box is moved out of the goal, so the grades minus one
                } else { // the man is in the goal
                    boxAudio.play();
                    document.getElementById("id" + m + "_" + n).style.backgroundImage = "url(image/boxGoal.jpg)";
                    document.getElementById("id" + m + "_" + (n - 1)).style.backgroundImage = "url(image/goal.jpg)";
                    levelArray[m][n] = "BG";
                    levelArray[m][n - 1] = "G";
                }
            }
        } else { // in this case, in the last step the box is moved
            stepAudio.play();
        }
        n++; // the horizontal ordinate of the man plusses one
        $(man).css("left", n * 50 + "px"); // the man picture is moved to the right for one step
    } else if (checkKey == 38) { // when the last step is moving up
        $(man).css("background-image", "url(image/player.png)");
        if (checkBox == 1) {
            if (levelArray[m - 1][n] == "B") {
                push--;
                document.getElementById("push").innerHTML = "You have pushed " + push + " times";
                if (levelArray[m][n] != "G") {
                    stepAudio.play();
                    document.getElementById("id" + m + "_" + n).style.backgroundImage = "url(image/box.jpg)";
                    document.getElementById("id" + (m - 1) + "_" + n).style.backgroundImage = "url(image/road.jpg)";
                    levelArray[m][n] = "B";
                    levelArray[m - 1][n] = "R";
                } else {
                    boxAudio.play();
                    document.getElementById("id" + m + "_" + n).style.backgroundImage = "url(image/boxGoal.jpg)";
                    document.getElementById("id" + (m - 1) + "_" + n).style.backgroundImage = "url(image/road.jpg)";
                    levelArray[m][n] = "BG";
                    levelArray[m - 1][n] = "R";
                    grade++;
                }
            } else if (levelArray[m - 1][n] == "BG") {
                push--;
                document.getElementById("push").innerHTML = "You have pushed " + push + " times";
                if (levelArray[m][n] != "G") {
                    stepAudio.play();
                    document.getElementById("id" + m + "_" + n).style.backgroundImage = "url(image/box.jpg)";
                    document.getElementById("id" + (m - 1) + "_" + n).style.backgroundImage = "url(image/goal.jpg)";
                    levelArray[m][n] = "B";
                    levelArray[m - 1][n] = "G";
                    grade--;
                } else {
                    boxAudio.play();
                    document.getElementById("id" + m + "_" + n).style.backgroundImage = "url(image/boxGoal.jpg)";
                    document.getElementById("id" + (m - 1) + "_" + n).style.backgroundImage = "url(image/goal.jpg)";
                    levelArray[m][n] = "BG";
                    levelArray[m - 1][n] = "G";
                }
            }
        } else {
            stepAudio.play();
        }
        m++; // longitudinal coordinate of the man plusses one becasue the man is retreated
        $(man).css("top", m * 50 + "px");
    }
    else if (checkKey == 40) { //when the last step is moving down
        $(man).css("background-image", "url(image/player.png)");
        if (checkBox == 1) {
            if (levelArray[m + 1][n] == "B") {
                push--;
                document.getElementById("push").innerHTML = "You have pushed " + push + " times";
                if (levelArray[m][n] != "G") {
                    stepAudio.play();
                    document.getElementById("id" + m + "_" + n).style.backgroundImage = "url(image/box.jpg)";
                    document.getElementById("id" + (m + 1) + "_" + n).style.backgroundImage = "url(image/road.jpg)";
                    levelArray[m][n] = "B";
                    levelArray[m + 1][n] = "R";
                } else {
                    boxAudio.play();
                    document.getElementById("id" + m + "_" + n).style.backgroundImage = "url(image/boxGoal.jpg)";
                    document.getElementById("id" + (m + 1) + "_" + n).style.backgroundImage = "url(image/road.jpg)";
                    levelArray[m][n] = "BG";
                    levelArray[m + 1][n] = "R";
                    grade++;
                }
            } else if (levelArray[m + 1][n] == "BG") {
                push--;
                document.getElementById("push").innerHTML = "You have pushed " + push + " times";
                if (levelArray[m][n] != "G") {
                    stepAudio.play();
                    document.getElementById("id" + m + "_" + n).style.backgroundImage = "url(image/box.jpg)";
                    document.getElementById("id" + (m + 1) + "_" + n).style.backgroundImage = "url(image/goal.jpg)";
                    levelArray[m][n] = "B";
                    levelArray[m + 1][n] = "G";
                    grade--;
                } else {
                    boxAudio.play();
                    document.getElementById("id" + m + "_" + n).style.backgroundImage = "url(image/boxGoal.jpg)";
                    document.getElementById("id" + (m + 1) + "_" + n).style.backgroundImage = "url(image/goal.jpg)";
                    levelArray[m][n] = "BG";
                    levelArray[m + 1][n] = "G";
                }
            }
        } else {
            stepAudio.play();
        }
        m--;
        $(man).css("top", m * 50 + "px");
    } else if (checkKey == 39) { // when the last step is moving to the right
        $(man).css("background-image", "url(image/left.png)");
        if (checkBox == 1) {
            if (levelArray[m][n + 1] == "B") {
                push--;
                document.getElementById("push").innerHTML = "You have pushed " + push + " times";
                if (levelArray[m][n] != "G") {
                    stepAudio.play();
                    document.getElementById("id" + m + "_" + n).style.backgroundImage = "url(image/box.jpg)";
                    document.getElementById("id" + m + "_" + (n + 1)).style.backgroundImage = "url(image/road.jpg)";
                    levelArray[m][n] = "B";
                    levelArray[m][n + 1] = "R";
                } else {
                    boxAudio.play();
                    document.getElementById("id" + m + "_" + n).style.backgroundImage = "url(image/boxGoal.jpg)";
                    document.getElementById("id" + m + "_" + (n + 1)).style.backgroundImage = "url(image/road.jpg)";
                    levelArray[m][n] = "BG";
                    levelArray[m][n + 1] = "R";
                    grade++;
                }
            } else if (levelArray[m][n + 1] == "BG") {
                push--;
                document.getElementById("push").innerHTML = "You have pushed " + push + " times";
                if (levelArray[m][n] != "G") {
                    stepAudio.play();
                    document.getElementById("id" + m + "_" + n).style.backgroundImage = "url(image/box.jpg)";
                    document.getElementById("id" + m + "_" + (n + 1)).style.backgroundImage = "url(image/goal.jpg)";
                    levelArray[m][n] = "B";
                    levelArray[m][n + 1] = "G";
                    grade--;
                } else {
                    boxAudio.play();
                    document.getElementById("id" + m + "_" + n).style.backgroundImage = "url(image/boxGoal.jpg)";
                    document.getElementById("id" + m + "_" + (n + 1)).style.backgroundImage = "url(image/goal.jpg)";
                    levelArray[m][n] = "BG";
                    levelArray[m][n + 1] = "G";
                }
            }
        } else {
            stepAudio.play();
        }
        n--;
        $(man).css("left", n * 50 + "px");
    }
    stepArray.pop();
    boxArray.pop();
}
function getReset() { // reset the map
    stepAudio.play();
    getLevel();
}
var selLevel=document.getElementsByTagName("select"); // get the tag of the selection
for(var z=0; z<selLevel.length; z++){ // to make the keyboard out of control the selection, otherwise it will affect the game negatively
    selLevel[z].onkeydown=function(e){
        e.preventDefault();
    }
}
var allLevels = [ // all of the arrays of the maps in all levels
    [["N", "W", "W", "W", "W", "W", "W", "W"],
        ["W", "W", "R", "R", "R", "R", "R", "W"],
        ["W", "R", "R", "B", "B", "B", "R", "W"],
        ["W", "W", "W", "W", "R", "R", "R", "W"],
        ["W", "W", "W", "W", "R", "R", "R", "W"],
        ["W", "G", "G", "R", "R", "R", "R", "W"],
        ["W", "G", "R", "R", "R","R", "W", "W"],
        ["W", "W", "W", "W", "W", "W", "W", "W"]],

    [["W", "W", "W", "N", "N", "N", "W", "W", "W"],
        ["W", "R", "G", "W", "N", "W", "R", "G", "W"],
        ["W", "R", "R", "R", "W", "R", "R", "R", "W"],
        ["W", "R", "R", "B", "R", "B", "R", "R", "W"],
        ["W", "G", "R", "R", "B", "R", "B", "R", "W"],
        ["W", "R", "W", "R", "B", "W", "R", "G", "W"],
        ["N", "W", "R", "R", "R","R", "R", "W", "N"],
        ["N", "N", "W", "W", "R", "W", "W", "N", "N"],
        ["N", "N", "N", "W", "G", "W", "N", "N", "N"],
        ["N", "N", "N", "N", "W", "N", "N", "N", "N"]],

    [["N", "N", "W", "W", "W", "W", "W", "N"],
        ["N", "W", "W", "R", "R", "R", "W", "W"],
        ["W", "G", "W", "R", "B", "R", "R", "W"],
        ["W", "R", "B", "R", "R", "B", "R", "W"],
        ["W", "R", "R", "B", "R", "B", "R", "W"],
        ["W", "G", "R", "R", "W", "W", "W", "W"],
        ["W", "G", "G", "G", "W","N", "N", "N"],
        ["W", "W", "W", "W", "W", "N", "N", "N"]],

    [["N", "N", "N", "W", "W", "W", "W", "W", "W"],
        ["N", "W", "W", "W", "G", "W", "W", "G", "W"],
        ["W", "W", "W", "G", "B", "W", "W", "R", "W"],
        ["W", "W", "R", "B", "R", "B", "R", "R", "W"],
        ["W", "R", "R", "R", "R", "R", "B", "R", "W"],
        ["W", "G", "R", "R", "B", "R", "R", "G", "W"],
        ["W", "R", "R", "W", "W","R", "R", "W", "W"],
        ["W", "W", "W", "W", "W", "W", "W", "W", "N"]],

    [["W", "W", "W", "W", "W", "W", "N", "N"],
        ["W", "G", "R", "B", "R", "W", "N", "N"],
        ["W", "G", "W", "R", "R", "W", "W", "W"],
        ["W", "R", "B", "B", "R", "R", "R", "W"],
        ["W", "R", "R", "R", "B", "W", "W", "W"],
        ["W", "W", "W", "R", "R", "B", "G", "W"],
        ["W", "G", "G", "R", "R","R", "W", "W"],
        ["W", "W", "W", "W", "W", "W", "N", "N"]],
];
var level = 0;  // set the level as 0
var levelArray = JSON.parse(JSON.stringify(allLevels[level])) // get the allLevels[0] which is the array of the map of the first level
var grade = 0;
var goalNum = 0; // set the number of the goals as 0
var step = 0;
var push = 0; // set the number of the push times as 0 (the times that the man pushes the box)
var n; // the variable of the horizontal ordinate of the man
var m; // the variable of the longitudinal coordinates of the man
var key;
var man = document.createElement("div"); // add the tag 'div' to the man
var stepArray = []; // to get the step direction of the the man moving, which is used in the retreat funtcion
var boxArray = []; // to get the information that if the box moved(if the box is moved, the '1' will be pushed in, otherwise '0' will be pushed in), which is used in the retreat funtcion
var alert=document.getElementById("alert");
var end=document.getElementById("end");
var stepAudio = new Audio(); //
stepAudio.src = "https://www.dropbox.com/s/62vvoz597uae8ra/Tick-DeepFrozenApps-397275646.mp3?dl=1";
var boxAudio = new Audio();
boxAudio.src = "https://www.dropbox.com/s/lp1p6qjpkx135hg/Button_Push-Mike_Koenig-1659525069%20%281%29.mp3?dl=1";
var stopAudio = new Audio();
stopAudio.src = "https://www.dropbox.com/s/v0poxj2j0li1pyy/fire_bow_sound-mike-koenig.mp3?dl=1";
var winAudio = new Audio();
winAudio.src = "https://www.dropbox.com/s/5qulukc46b9nvlj/Music_Box-Big_Daddy-1389738694.mp3?dl=1";