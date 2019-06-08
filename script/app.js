// import { initialSort, calculateElementsPerBucket, simpleSort, calculateBeginIndexOfBucket, updateBucketArray } from "./ManberMyersDivided";




// key-indexed countng sort
function initialSort(arr)
{
    let amountOfLetters = new Map();// new Array(256).fill(0);

    for (let ch of arr)
    {
        if (amountOfLetters.has(ch))
        {
            amountOfLetters.set(ch, amountOfLetters.get(ch) + 1);
        }
        else
        {
            amountOfLetters.set(ch, 1);
        }
        
    }
    amountOfLetters.set("", 1);

    let keys = amountOfLetters.keys();
    let keyArr = Array.from(keys);
    simpleSort(keyArr);

    for (let i = keyArr.length-2; i >= 0; --i)
    {
        let currKey = keyArr[i];
        let nextKey = keyArr[i+1];
        amountOfLetters.set(nextKey, amountOfLetters.get(currKey));
    }
    amountOfLetters.set(keyArr[0], 0);

    for (let i = 0; i < keyArr.length-1; ++i)
    {
        let currKey = keyArr[i];
        let nextKey = keyArr[i+1];
        
        amountOfLetters.set(nextKey, amountOfLetters.get(nextKey) + amountOfLetters.get(currKey));
    }

    let res = new Array(arr.length + 1);

    for (const [i, ch] of arr.split("").entries())
    {
        res[amountOfLetters.get(ch)] = i;
        amountOfLetters.set(ch, amountOfLetters.get(ch)+1);
    }
    res[0] = arr.length;


    return res;
}

function getReverse(order)
{
    let result = new Array(order.length);

    for (let i of order)
    {
        result[order[i]] = i;
    }

    return result;
}

function getFirstOrderBuckets(txt, ordered)
{
    let ch = '';
    let currentIndex = 0;
    let buckets = new Array(ordered.length);
    for (let [index, orderIndex] of ordered.entries())
    {
        if (ch != txt[orderIndex])
        {
            currentIndex = index;
            ch = txt[orderIndex];
        }
        buckets[index] = currentIndex;
    }

    return buckets;
}

function getSuffixPosition(oldOrder, reverse, n, index)
{
    let origTextIndex = oldOrder[index];
    let shifted = origTextIndex + n;

    return reverse[shifted];
}

function getBucketReferences(buckets)
{
    let bucketRefs = [];

    let last = buckets[0];
    bucketRefs.push(0);

    for (let i = 1; i < buckets.length; ++i)
    {
        if (last !== buckets[i])
        {
            last = buckets[i];
            bucketRefs.push(i);
        }
    }
    bucketRefs.push(buckets.length)

    return bucketRefs;
}

function simpleSort(arr)
{
    for (let i = 1; i < arr.length; ++i)
    {
        for (let j = i; j >= 0; --j)
        {
            if (arr[j] < arr[j-1])
            {
                [arr[j], arr[j-1]] = [arr[j-1], arr[j]];
            }
        }
    }
}

function calculateElementsPerBucket(startIndexOfBucket, endIndexOfBucket, buckets, order, reverse, n)
{
    let elementsPerBucketMap = new Map();
    for (let j = startIndexOfBucket; j < endIndexOfBucket; ++j)
    {
        let suffixOrderIndex = getSuffixPosition(order, reverse, n, j);
        if (elementsPerBucketMap.has(buckets[suffixOrderIndex]))
        {
            elementsPerBucketMap.set(buckets[suffixOrderIndex], elementsPerBucketMap.get(buckets[suffixOrderIndex])+1);
        }
        else
        {
            elementsPerBucketMap.set(buckets[suffixOrderIndex], 1);
        }
    }

    return elementsPerBucketMap;
}

function calculateBeginIndexOfBucket(elementsPerBucketMap, sortedKeys)
{
    for (let i = sortedKeys.length-1; i >= 1; --i)
    {
        elementsPerBucketMap.set(sortedKeys[i], elementsPerBucketMap.get(sortedKeys[i-1]));
    }
    elementsPerBucketMap.set(sortedKeys[0], 0);

    for (let i = 1; i < sortedKeys.length; ++i)
    {
        elementsPerBucketMap.set(sortedKeys[i],
            elementsPerBucketMap.get(sortedKeys[i]) + elementsPerBucketMap.get(sortedKeys[i-1]));
    }
}

function updateBucketArray(newBuckets, elementsPerBucketMap, sortedKeysArr, currentBucketStart, currentBucketEnd)
{
    for (let j = 1; j < sortedKeysArr.length; ++j)
    {
        let begin = elementsPerBucketMap.get(sortedKeysArr[j-1]);
        let end   = elementsPerBucketMap.get(sortedKeysArr[j]);
        for (let k = begin; k < end; ++k)
        {
            newBuckets[k + currentBucketStart] = begin + currentBucketStart;
        }
    }

    // that part is for including last bucket
    let begin = elementsPerBucketMap.get(sortedKeysArr[sortedKeysArr.length-1]) + currentBucketStart;
    for (let k = begin; k < currentBucketEnd; ++k)
    {
        newBuckets[k] = begin;
    }
}

function updateOrder(newOrder, order, reverse, elementsPerBucketMap, buckets, startBucket, endBucket, prefixSize)
{
    for (let j = startBucket; j < endBucket; ++j)
    {
        let suffixOrderIndex = getSuffixPosition(order, reverse, prefixSize, j);
        let bucketRef = buckets[suffixOrderIndex];
        let newIndex = startBucket + elementsPerBucketMap.get(bucketRef);

        newOrder[newIndex] = order[j];
        elementsPerBucketMap.set(bucketRef, elementsPerBucketMap.get(bucketRef) + 1);
    }
}

function nOrderSort(txt, order, buckets, n)
{
    //----------------------------------------------------
    // n sorting inisialization
    //----------------------------------------------------
    let reverse = getReverse(order);
    let bucketRefs = getBucketReferences(buckets);
    let newBuckets = new Array(buckets.length).fill(0);
    let newOrder = [...order];
    //----------------------------------------------------

    for (let i = 2; i < bucketRefs.length; ++i)
    {
        let startBucket = bucketRefs[i-1];
        let endBucket = bucketRefs[i];

        if (order[startBucket] === txt.length) { continue; }

        //--------------------------------------------------
        // calculate how many elements per bucket
        //--------------------------------------------------
        let elementsPerBucketMap = calculateElementsPerBucket(startBucket, endBucket, buckets, order, reverse, n);
        //----------------------------------------------------
        let keys = elementsPerBucketMap.keys();
        let keysArr = Array.from(keys);
        simpleSort(keysArr);
        //----------------------------------------------------

        //-----------------------------------------------------
        // calculate initial indexes of buckets
        //-----------------------------------------------------
        calculateBeginIndexOfBucket(elementsPerBucketMap, keysArr);

        // ---------------------------------------------------------------------
        // put new values to newBucket
        // ---------------------------------------------------------------------
        updateBucketArray(newBuckets, elementsPerBucketMap, keysArr, startBucket, endBucket);
        // ---------------------------------------------------------------------

        updateOrder(newOrder, order, reverse, elementsPerBucketMap, buckets, startBucket, endBucket, n);
    }

    return [newOrder, newBuckets];
}

function getSortedSuffixIndexes(txt)
{
    let order = initialSort(txt);
    let buckets = getFirstOrderBuckets(txt, order);
    for (let n = 1; n < txt.length*2; n *= 2)
    {
        [order, buckets] = nOrderSort(txt, order, buckets, n);
    }

    return order;
}

let StateMachine = [
    {
        state: "Start", 
        handler: function(status) {

            status.order = initialSort(status.text);
            status.buckets = getFirstOrderBuckets(status.text, status.order);
            status.prefixSize = 1;
            status.startBucketIndex = -1;
            status.elementsPerBucketMap = new Map();
            
            return "NSortStart";
        },
        id: "start_description",
        description: "start of the algorithm",
        code: "start_code"
    },

    {
        state: "NSortStart", 
        handler: function(status) {

            status.reverse = getReverse(status.order);
            status.bucketRefs = getBucketReferences(status.buckets);
            if (status.bucketRefs.length === status.buckets.length+1)
            {
                console.log("finish!!")
                return "Finish";
            }
            status.newBuckets = [...status.buckets];
            status.newOrder = [...status.order];
            status.startBucketIndex = 1;

            return "ElementAmountCalculation";
        },
        id: "n_sort_start_description",
        description: "start sorting n-character prefix substrings",
        code: "nsort_start_code"
    },

    {
        state: "ElementAmountCalculation", 
        handler: function(status) {
            status.bucketCounter = calculateElementsPerBucket(status.bucketRefs[status.startBucketIndex-1], status.bucketRefs[status.startBucketIndex]
                , status.buckets, status.order, status.reverse, status.prefixSize);

            let keys = status.bucketCounter.keys();
            status.sortedKeys = Array.from(keys);
            simpleSort(status.sortedKeys);

            return "SumUp";
        },
        id: "calculate_bucket_elements_description",
        description: "calculates amount of elements in subbuckets",
        code: "element_calculation_code"
    },

    {
        state: "SumUp", 
        handler: function(status) {

            calculateBeginIndexOfBucket(status.bucketCounter, status.sortedKeys);

            return "BucketArrayUprate";
        },
        id: "sumup_bucket_elements_description",
        description: "sets up local offset of subbuckets",
        code: "sumup_code"
    },
    
    {
        state: "BucketArrayUprate", 
        handler: function(status) {
            updateBucketArray(status.newBuckets, status.bucketCounter, status.sortedKeys, status.bucketRefs[status.startBucketIndex-1], status.bucketRefs[status.startBucketIndex]);
            return "UpdateOrder";
        },
        id: "update_bucket_array_description",
        description: "split current bucket in subbuckets",
        code: "update_bucket_array_code"
    },

    {
        state: "UpdateOrder", 
        handler: function(status) {

            updateOrder(status.newOrder, status.order, status.reverse, status.bucketCounter, status.buckets
                , status.bucketRefs[status.startBucketIndex-1], status.bucketRefs[status.startBucketIndex], status.prefixSize);

            // status.startBucketIndex++;
            let begin = 0;
            let end = 0;
            do
            {
                if (status.startBucketIndex === status.bucketRefs.length-1)
                {
                    return "NSortEnd";
                }
                status.startBucketIndex++;
                begin = status.bucketRefs[status.startBucketIndex-1];
                end = status.bucketRefs[status.startBucketIndex];
            } while (begin+1 === end);

            return "ElementAmountCalculation";
        },
    id: "update_order_description",
    description: "update order in particular bucket",
    code: "update_order_code"
    },

    {
        state: "NSortEnd",
        handler: function(status) {
            status.order = [...status.newOrder];
            status.buckets = [...status.newBuckets];

            status.prefixSize *= 2;

            if (status.prefixSize === status.text.length)
            {
                return "Finish";
            }

            return "NSortStart";
        },
        id: "nsort_end_description",
        description: "n-character sorting is finished. Let's double size of prefix",
        code: "nsort_end_code"
    },

    {
        state: "Finish",
        handler: function(status) {
            console.log("finish execution");

            $('#algo_data').empty();
            $("#bucket_data").empty();
            $("#function_code_viewer").empty();
            $("#forward").disabled = true;
            return "";
        },
        id: "finish_description",
        description: "",
        code: ""
    },

]



let condition = 
{}

window.init = function()
{
    condition = 
    {
        state: "Start",
        text: null,

        reverse: null,

        order: null,
        buckets: null,
        bucketRefs: null,

        newOrder: null,
        newBuckets: null,
        newBucketRefs: null,

        prefixSize: 0,
        startBucketIndex: -1,
        endBucket: -1,
        sortedKeys: null,

        bucketCounter: null
    };

    let input_field = document.querySelector("#algo_input");
    condition.text = input_field.value;

    let appendButton = document.querySelector("#forward");
    appendButton.disabled = false;

    for (let state of StateMachine)
    {
        $("#" + state.id).css("background-color", "white");
        // $("#" + state.code).hide();
    }  
}

window.onload = init;


window.doForward = function()
{
    for (let state of StateMachine)
    {
        $("#" + state.id).css("background-color", "white");
        $("#" + state.code).hide();
        // $("#" + state.code).removeAttr("hidden");
    }

    for (let state of StateMachine)
    {
        if (state.state === condition.state)
        {
            condition.state = state.handler(condition);

            $("#" + state.id).css("background-color", "yellow");
            let el = $("#" + state.code)
            el.show();

            if (condition.state === "") {return ;} 
            updateTable(condition);
            if (condition.bucketCounter)
            {
                updateBucketInfo(condition);
            }
            return ;
        }
    }

    this.console.log(condition.state);
    throw "beeep!!";
}

function adjustIframeSize(newHeight, newWidth) {
    var i = document.getElementById("gistFrame");
    i.style.height = parseInt(newHeight) + "px";
    i.style.width = parseInt(document.body.clientWidth/3) + "px";
}

function addRow(condition, colors, i)
{
    let local_index = i-condition.buckets[i];
        
    $('#algo_data').append('<tr>' 
                + '<td bgcolor="#' + colors[local_index%2].toString(16) + '">' + condition.text.substring(condition.order[i], condition.order[i]+condition.prefixSize) + " " + condition.text.substring(condition.order[i]+condition.prefixSize) + '</td>' 
                + '<td bgcolor="#' + colors[local_index%2].toString(16) + '">'  + condition.buckets[i] + '</td>' 
                + ( condition.newOrder !== null ? '<td bgcolor="#' + colors[local_index%2].toString(16) + '">'  + condition.text.substring(condition.newOrder[i]) + '</td>' : "")
            + '</tr>');
}

window.updateBucketInfo = function(condition)
{

    $('#bucket_data').empty();
    $('#bucket_data').append('<tr>' 
            + '<th>bucket id</th>' 
            + '<th>bucket amount</th>' 
        + '</tr>');

    for (let i = 0; i < condition.sortedKeys.length; ++i)
    {
        let bucketStart = condition.sortedKeys[i];
        let startIndex = condition.order[bucketStart];
        $('#bucket_data').append('<tr>' 
            + '<td>' + condition.text.substring(startIndex, startIndex+condition.prefixSize) + '</td>' 
            + '<td>' + condition.bucketCounter.get(bucketStart) + '</td>' 
        + '</tr>');
    }
    
}

window.updateTable = function(condition)
{

    let colors = [0xE8FFE8
                , 0xF0FFF0

                , 0xE8E8FF
                , 0xF0F0FF

                , 0xE8E8E0
                , 0xF0F0F0
            ];

    let colorCounter = 0;
    let lastIndex = 0;

    $('#algo_data').empty();
    $('#algo_data').append('<tr>' 
                    + '<th>suffix</th>' 
                    + '<th>bucket index</th>' 
                    + ((condition.newOrder !== null) ? '<th>new bucket index</th>' : '')
                + '</tr>');

    for (let i = 0; i < condition.order.length; ++i)
    {
        
        if (condition.buckets[i] !== lastIndex)
        {
            colorCounter++;
            lastIndex = condition.buckets[i];
        }

        if (condition.buckets && condition.bucketRefs && condition.buckets[i] === condition.bucketRefs[condition.startBucketIndex-1])
        {
            addRow(condition, colors.slice(4), i);
        }
        else {
            addRow(condition, colors.slice((colorCounter%2)*2), i);
        }
        
    }
}

window.updateCode = function(condition)
{
    $("#function_code_viewer").html('<script src="' + condition.code + '"></script>');
}