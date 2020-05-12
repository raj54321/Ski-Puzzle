'use strict'
// [top , bottom , left , right]

$(document).ready(function () {
    var moves = 0
    var check1 = ''
    var check2 = ''
    var mainTile = ''
    var find = ''
    let find2 = ''
    var prev = ''
    var arr = []
    var arr2 = []

    //original titles~ original positions
    var oritiles = {
        t1: ['green2', 'green1', 'purple1', 'ch_green1'],
        t2: ['green1', 'pink2', 'purple2', 'ch_green1'],
        t3: ['green1', 'pink1', 'ch_green2', 'ch_green1'],
        t4: ['ch_green2', 'pink1', 'purple1', 'ch_green1'],
        t5: ['green1', 'pink2', 'purple2', 'ch_green1'],
        t6: ['green2', 'pink1', 'purple1', 'ch_green1'],
        t7: ['green1', 'pink1', 'purple1', 'ch_green2'],
        t8: ['green2', 'purple1', 'purple1', 'green2'],
        t9: ['green1', 'pink2', 'purple2', 'ch_green1']
    }

    //tiles in use during play
    var tiles = {
        t1: ['purple1', 'green2', 'ch_green1', 'pink1'],
        t2: ['ch_green1', 'purple2', 'pink2', 'green1'],
        t3: ['pink1', 'purple1', 'green2', 'purple1'],
        t4: ['ch_green2', 'ch_green1', 'pink1', 'purple1'],
        t5: ['pink1', 'purple1', 'green1', 'ch_green2'],
        t6: ['green1', 'pink2', 'ch_green1', 'purple2'],
        t7: ['pink2', 'purple2', 'ch_green1', 'green1'],
        t8: ['green2', 'pink2', 'green1', 'purple1'],
        t9: ['ch_green2', 'green1', 'ch_green1', 'pink1']
    }
    
    var keys = Object.keys(tiles)
    var values = Object.values(tiles)
    var solutions = {
        s1: ['t7', 't8', 't9', 't6', 't1', 't2', 't5', 't4', 't3'],
        s2: ['t9', 't2', 't3', 't8', 't1', 't4', 't7', 't6', 't5']
    }

    //displaying the images
    var contents = [
        '<div id="dt1"><img alt=" " draggable="true" class="zero" src="img/img01.jpg " id="t1"></div>', ' <div id="dt2"><img alt=" " draggable="true" class="zero" src="img/img02.jpg " id="t2"></div>', '<div id="dt3"><img alt=" " draggable="true" class="zero" src="img/img03.jpg " id="t3"></div>', '<div id="dt4"><img alt=" " draggable="true" class="zero" src="img/img04.jpg " id="t4"></div>', '<div id="dt5"><img alt=" " draggable="true" class="zero" src="img/img05.jpg " id="t5"></div>', '<div id="dt6"><img alt=" " draggable="true" class="zero" src="img/img06.jpg " id="t6"></div>', '<div id="dt7"><img alt=" " draggable="true" class="zero" src="img/img07.jpg " id="t7"></div>', '<div id="dt8"><img alt=" " draggable="true" class="zero" src="img/img08.jpg " id="t8"></div>', '<div id="dt9"><img alt=" " draggable="true" class="zero" src="img/img09.jpg " id="t9"></div>'
    ]

    //displaying images in a random order:
    var nums = []
    do {
        var idx = g_rand(0, 9)
        // console.log(idx)
        if (!nums.includes(idx)) {
            document.getElementById('images').innerHTML += contents[idx]
            nums.push(idx)
        }
    } while (nums.length < 9)

    var imgs = $('#images').find('img') // creating an image array
    for (let i = 0; i < imgs.length; i++) { // asigning events to image
        imgs[i].addEventListener('click', rotate)
        imgs[i].addEventListener('dragstart', dragStartM)
    }
    
    var deg = ['zero', 'ninety', 'oneeighty', 'twoseventy'] // roatatting randomly
    for (let i = 0; i < imgs.length; i++) {
        var r = g_rand(0, 3)
        while (r > 0) {
            imgs[i].click() //calling the click event to rotate image random number of times
            r--
        }
    }

    // randomly assigning rotation degrees to images
    function rotate (event) {
        var x = event.target.parentElement.parentElement.id
        if (x === 'images') {
            var elem = tiles[event.target.id].pop()
            // console.log(event.target.id)

            // console.log(tiles[event.target.id])

            tiles[event.target.id].unshift(elem)
            // console.log(tiles[event.target.id])
            if (this.className === 'zero') {
                this.className = 'ninety'
            } else if (this.className === 'ninety') {
                this.className = 'oneeighty'
            } else if (this.className === 'oneeighty') {
                this.className = 'twoseventy'
            } else if (this.className === 'twoseventy') {
                this.className = 'zero'
            } else {
                this.className = 'ninety'
            }
        }
    }

    function dragStartM (ev) {
        var x = event.target.parentElement.parentElement.id
        updateDropArea()
        if (x === 'images') {
            ev.dataTransfer.setData('Text', ev.target.id)
            var img = new Image()
            img.src = ev.target.getAttribute('src')
            img.className = ev.target.getAttribute('class')
            ev.dataTransfer.setDragImage = img
            ev.dataTransfer.effectAllowed = 'move'
        }
        console.clear()
    }
    $('#rmLast').click(function (event) {
        var dropedImags = $('#div' + (moves - 1)).find('img')
        $('#' + dropedImags[0].id).appendTo($('#d' + dropedImags[0].id))
        if (moves !== 9) {
            document.getElementById('div' + moves).removeEventListener('dragover', dragOverEv)
            document.getElementById('div' + moves).removeEventListener('drop', dropEv)
        }
        moves--
        document.getElementById('div' + moves).addEventListener('dragover', dragOverEv)
        document.getElementById('div' + moves).addEventListener('drop', dropEv)
        check1 = ''
        check2 = ''
        if (moves - 1 === -1) {
            arr = keys.slice()
        }
        if (moves - 1 >= 0) {
            prev = $('#div' + (moves - 1)).find('img')
            var previd = prev[0].id
            if (check1 !== '') {
                var num = check1[check1.length - 1]
                var color = check1.substring(0, check1.length - 1)
                find = num === '1' ? (color + 2) : (color + 1)
                // console.log(find)

                arr = []
                for (let i = 0; i < keys.length; i++) {
                    for (let j = 0; j < values[i].length; j++) {
                        if (find === values[i][j]) {
                            arr.push(keys[i])
                            break
                        }
                    }
                }
                if (check2 !== '') {
                    var num2 = check2[check2.length - 1]
                    color = check2.substring(0, check2.length - 1)
                    find2 = num2 === '1' ? color + 2 : color + 1
                    // console.log(find2)
                    arr2 = []
                    for (let k = 0; k < arr.length; k++) {
                        for (let i = 0; i < keys.length; i++) {
                            for (let j = 0; j < values[i].length; j++) {
                                if (find2 === values[i][j]) {
                                    if (arr[k] !== keys[i]) {
                                        break
                                    } else {
                                        arr2.push(keys[i])
                                    }
                                }
                            }
                        }
                    }
                    arr = arr2.slice()
                }
            }
        }
        if (arr.length > 0) {
            for (let j = 0; j < keys.length; j++) {
                // // console.log(arr[j])
                var id2 = '#' + keys[j]
                $(id2).css('opacity', '0.5')
                $(id2).unbind('dragstart', dragStartM)
            }

            for (let j = 0; j < arr.length; j++) {
                // // console.log(arr[j])
                var id = '#' + arr[j]
                $(id).css('opacity', '1')
                $(id).bind('dragstart', dragStartM)
            }
        } else {
            if (moves < 8) { alert('no moves possible!!.. to try other option remove last tile') }
        }

        // moves--
    })

    function dragOverEv (event) {
        event.preventDefault()
    }

    function dropEv (ev) {
        ev.preventDefault()
        var data = ev.dataTransfer.getData('text')
        var elem = document.getElementById(data)
        var flag = false

        switch (moves) {
        case 0:
            flag = true
            var mt = elem.getAttribute('id')
            mainTile = mt
            check1 = tiles[mainTile][1]
            check2 = ''
            break
        case 1:
            if (tiles[data][3] === find) {
                flag = true
                prev = elem.getAttribute('id')
                check1 = tiles[prev][2]
                check2 = ''
            } else {
                flag = false
            }

            break
        case 2:
            if (tiles[data][0] === find) {
                flag = true
                prev = elem.getAttribute('id')
                check1 = tiles[prev][3]
                check2 = tiles[mainTile][2]
            } else {
                flag = false
            }

            break
        case 3:
            if (tiles[data][0] === find2 && tiles[data][1] === find) {
                flag = true
                prev = elem.getAttribute('id')
                check1 = tiles[prev][3]
                check2 = ''
            } else {
                flag = false
            }

            break
        case 4:
            if (tiles[data][1] === find) {
                flag = true
                prev = elem.getAttribute('id')
                check1 = tiles[prev][0]
                check2 = tiles[mainTile][3]
            } else {
                flag = false
            }
            break
        case 5:
            if (tiles[data][1] === find2 && tiles[data][2] === find) {
                flag = true
                prev = elem.getAttribute('id')
                check1 = tiles[prev][0]
                check2 = ''
            } else {
                flag = false
            }

            break
        case 6:
            if (tiles[data][2] === find) {
                flag = true
                prev = elem.getAttribute('id')
                check1 = tiles[prev][1]
                check2 = tiles[mainTile][0]
            } else {
                flag = false
            }

            break
        case 7:
            if (tiles[data][2] === find2 && tiles[data][3] === find) {
                flag = true
                prev = elem.getAttribute('id')
                check1 = tiles[prev][1]
                check2 = ''
            } else {
                flag = false
            }

            break
        case 8:
            if (tiles[data][3] === find) {
                flag = true
                prev = elem.getAttribute('id')
                check1 = ''
                check2 = ''
            } else {
                flag = false
            }
            break
        }

        var num = check1[check1.length - 1]
        var color = check1.substring(0, check1.length - 1)
        find = num === '1' ? (color + 2) : (color + 1)
        // console.log(find)
        arr = []
        for (let i = 0; i < keys.length; i++) {
            for (let j = 0; j < values[i].length; j++) {
                if (find === values[i][j]) {
                    arr.push(keys[i])
                    break
                }
            }
        }
        if (check2 !== '') {
            var num2 = check2[check2.length - 1]
            color = check2.substring(0, check2.length - 1)
            find2 = num2 === '1' ? color + 2 : color + 1
            arr2 = []
            for (let k = 0; k < arr.length; k++) {
                for (let i = 0; i < keys.length; i++) {
                    if (arr[k] === keys[i]) {
                        for (let j = 0; j < values[i].length; j++) {
                            if (find2 === values[i][j]) {
                                arr2.push(keys[i])
                            }
                        }
                    } else {
                        continue
                    }
                }
            }
            arr = arr2.slice()
        }
        for (let j = 0; j < keys.length; j++) {
            // // console.log(arr[j])
            var id2 = '#' + keys[j]
            $(id2).css('opacity', '0.5')
            $(id2).unbind('dragstart', dragStartM)
        }
        if (arr.length > 0) {
            for (let j = 0; j < arr.length; j++) {
                // // console.log(arr[j])
                var id = '#' + arr[j]
                $(id).css('opacity', '1')
                $(id).bind('dragstart', dragStartM)
            }
        } else {
            if (moves < 8) { alert('no moves possible!!.. to try other option remove last tile') }
        }
        document.getElementById('div' + moves).removeEventListener('dragover', dragOverEv)
        document.getElementById('div' + moves).removeEventListener('drop', dropEv)
        if (flag) {
            ev.target.appendChild(elem)
            moves++
            updateDropArea()
            flag = false
        } else {
            alert('invalid move edge of previous image doesnt match')
        }
        if (moves === 9) {
            if (check_Solution()) {
                alert('Congrats!!!.. you made it.')
            }
        }
    }

    function updateDropArea () {
        if (moves !== 9) {
            document.getElementById('div' + moves).addEventListener('dragover', dragOverEv)
            document.getElementById('div' + moves).addEventListener('drop', dropEv)
        }
    }

    function check_Solution () {
        var dropedImags = $('#text').find('img')
       
        var solutionsKey = Object.keys(solutions)
        for (let i = 0; i < 2; i -= -1) {
            for (let j = 0; j < 9; j++) {
                // console.log(solutions[i][j])
                if (solutions[solutionsKey[i]][j] !== dropedImags[j].id) { isWin = false } else {
                   
                }
            }
            
        }
       
    }
    function g_rand (start = 0, count = 2) {
        return start + Math.floor(Math.random() * count)
    }

})
