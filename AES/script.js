/* =====================================================
   SECTION NAVIGATION
===================================================== */

function showSection(sectionId, button) {

    const sections =
        document.querySelectorAll(".section");


    sections.forEach(function(section) {

        section.classList.remove("active");

    });


    document
        .getElementById(sectionId)
        .classList.add("active");


    const buttons =
        document.querySelectorAll(".nav-button");


    buttons.forEach(function(btn) {

        btn.classList.remove("active");

    });


    button.classList.add("active");

}


/* =====================================================
   AES ENCRYPTION
===================================================== */

let encryptedData = null;


/*
    Convert text into bytes.
*/

function textToBytes(text) {

    return new TextEncoder().encode(text);

}


/*
    Convert bytes into Base64.
*/

function bytesToBase64(bytes) {

    let binary = "";


    bytes.forEach(function(byte) {

        binary += String.fromCharCode(byte);

    });


    return btoa(binary);

}


/*
    Convert Base64 back into bytes.
*/

function base64ToBytes(base64) {

    const binary =
        atob(base64);


    const bytes =
        new Uint8Array(binary.length);


    for (let i = 0; i < binary.length; i++) {

        bytes[i] =
            binary.charCodeAt(i);

    }


    return bytes;

}


/*
    Create an AES key from
    the 16-character user key.
*/

async function createAESKey(keyText) {

    const keyBytes =
        textToBytes(keyText);


    return await crypto.subtle.importKey(

        "raw",

        keyBytes,

        {
            name: "AES-CBC"
        },

        false,

        [
            "encrypt",
            "decrypt"
        ]

    );

}


/* =====================================================
   ENCRYPTION
===================================================== */

async function encryptMessage() {

    const plaintext =
        document
            .getElementById("plaintext")
            .value;


    const keyText =
        document
            .getElementById("key")
            .value;


    const ciphertextBox =
        document
            .getElementById("ciphertext");


    const decryptedBox =
        document
            .getElementById("decryptedText");


    if (plaintext.length === 0) {

        alert("Please enter some plaintext.");

        return;

    }


    /*
        AES-128 requires a 128-bit key,
        which is 16 bytes.
    */

    if (
        new TextEncoder()
            .encode(keyText)
            .length !== 16
    ) {

        alert(
            "Please enter exactly 16 characters for the key."
        );

        return;

    }


    try {

        const key =
            await createAESKey(keyText);


        /*
            AES-CBC requires a 16-byte IV.

            The IV is generated randomly.
        */

        const iv =
            crypto.getRandomValues(
                new Uint8Array(16)
            );


        const encrypted =
            await crypto.subtle.encrypt(

                {
                    name: "AES-CBC",

                    iv: iv

                },

                key,

                textToBytes(plaintext)

            );


        /*
            Store IV + ciphertext together.
        */

        const combined =
            new Uint8Array(
                iv.length +
                encrypted.byteLength
            );


        combined.set(iv, 0);


        combined.set(
            new Uint8Array(encrypted),
            iv.length
        );


        encryptedData =
            bytesToBase64(combined);


        ciphertextBox.innerText =
            encryptedData;


        decryptedBox.innerText =
            "Click Decrypt to recover the plaintext.";


        updateStateMatrix(
            textToBytes(plaintext)
        );


        document
            .getElementById("stepExplanation")
            .innerText =
            "Encryption completed. AES converted the plaintext into ciphertext using the supplied secret key.";

    }


    catch (error) {

        console.error(error);

        alert(
            "Encryption failed. Please check your input."
        );

    }

}


/* =====================================================
   DECRYPTION
===================================================== */

async function decryptMessage() {

    const keyText =
        document
            .getElementById("key")
            .value;


    const decryptedBox =
        document
            .getElementById("decryptedText");


    if (encryptedData === null) {

        alert(
            "Please encrypt a message first."
        );

        return;

    }


    if (
        new TextEncoder()
            .encode(keyText)
            .length !== 16
    ) {

        alert(
            "Please enter exactly 16 characters for the key."
        );

        return;

    }


    try {

        const combined =
            base64ToBytes(encryptedData);


        /*
            First 16 bytes = IV.
        */

        const iv =
            combined.slice(0, 16);


        /*
            Remaining bytes = ciphertext.
        */

        const ciphertext =
            combined.slice(16);


        const key =
            await createAESKey(keyText);


        const decrypted =
            await crypto.subtle.decrypt(

                {
                    name: "AES-CBC",

                    iv: iv

                },

                key,

                ciphertext

            );


        const plaintext =
            new TextDecoder()
                .decode(decrypted);


        decryptedBox.innerText =
            plaintext;


        document
            .getElementById("stepExplanation")
            .innerText =
            "Decryption completed. The ciphertext was converted back into the original plaintext using the same secret key.";

    }


    catch (error) {

        console.error(error);

        decryptedBox.innerText =
            "Decryption failed. Check that the key is correct.";

    }

}


/* =====================================================
   AES STEP EXPLANATIONS
===================================================== */

function showAESStep(step) {

    const explanation =
        document.getElementById(
            "stepExplanation"
        );


    if (step === 1) {

        explanation.innerText =
            "Input: The plaintext is the original readable information that we want to protect.";

    }


    else if (step === 2) {

        explanation.innerText =
            "AddRoundKey: The current AES state is combined with a round key using the XOR operation.";

    }


    else if (step === 3) {

        explanation.innerText =
            "SubBytes: Each byte in the state is replaced using the AES S-Box.";

    }


    else if (step === 4) {

        explanation.innerText =
            "ShiftRows: The rows of the AES state are shifted by different amounts.";

    }


    else if (step === 5) {

        explanation.innerText =
            "MixColumns: The bytes within each column are mathematically mixed to provide diffusion.";

    }


    else if (step === 6) {

        explanation.innerText =
            "Ciphertext: After the AES transformations are completed, the original plaintext has been converted into encrypted data.";

    }

}


/* =====================================================
   AES STATE MATRIX
===================================================== */

function updateStateMatrix(bytes) {

    const cells =
        document.querySelectorAll(
            "#stateMatrix div"
        );


    for (let i = 0; i < cells.length; i++) {

        if (i < bytes.length) {

            cells[i].innerText =
                bytes[i]
                    .toString(16)
                    .padStart(2, "0")
                    .toUpperCase();

        }


        else {

            cells[i].innerText =
                "00";

        }

    }

}


/* =====================================================
   QUIZ
===================================================== */

function calculateScore() {

    const questions = [

        "q1",
        "q2",
        "q3",
        "q4",
        "q5"

    ];


    let score = 0;

    let answered = 0;


    questions.forEach(function(question) {

        const selected =
            document.querySelector(
                'input[name="' +
                question +
                '"]:checked'
            );


        if (selected !== null) {

            answered++;


            if (selected.value === "correct") {

                score++;

            }

        }

    });


    const result =
        document.getElementById(
            "quizResult"
        );


    if (answered < questions.length) {

        result.innerText =
            "Please answer all five questions.";

        result.style.color =
            "#b45309";

        return;

    }


    result.innerText =
        "Your Score: " +
        score +
        " / " +
        questions.length;


    if (score >= 4) {

        result.innerText +=
            " — Excellent understanding!";

        result.style.color =
            "#16803c";

    }


    else if (score >= 3) {

        result.innerText +=
            " — Good job!";

        result.style.color =
            "#2563eb";

    }


    else {

        result.innerText +=
            " — Review the theory and try again.";

        result.style.color =
            "#b45309";

    }

}