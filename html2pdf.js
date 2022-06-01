#!/usr/bin/node

'use strict';

const http       = require('http');
const playwright = require('playwright');
const fs         = require('fs');
const uuid       = require('uuid');

const host = '0.0.0.0';
const port = '8080';

const handleRequest = function( req, res ) {
    //console.debug( req.method + " " + req.path );

    if ( req.method === 'POST' ) {
        const requestBody = [];
        req.on('data', (chunks) => {
            requestBody.push( chunks );
        });

        req.on('end', () => {
            const body = Buffer.concat(requestBody).toString();
            //console.debug("Body: " + body);

            try {
                let params = JSON.parse( body );
                let html   = Buffer.from( params.data, 'base64' ).toString('utf-8');

                console.debug('create pdf...');
                createPdf( res, html );
            } catch ( err ) {
                console.debug('invalid data');
                res.writeHead(400);
                res.end('invalid data');
                return;
            }
        });
    }
    else {
        console.debug('page not found');
        res.writeHead(404);
        res.end('page not found');
        return;
    }
};

const createPdf = async function ( res, html ) {

    // a minimal check if the data is html
    if ( html.match("</html>") == null ) {
        console.debug('invalid HTML data');
        res.writeHead(400);
        res.end('invalid HTML data');
        return;
    }

    let filename = '/tmp/' + uuid.v4();

    console.debug('filename: ' + filename);

    try {
        fs.writeFileSync(filename + '.html', html);

        const browser = await playwright.chromium.launch();
        const context = await browser.newContext();
        const page    = await context.newPage();

        await page.goto('file://' + filename + '.html');
        await page.pdf({
            path: filename + '.pdf',
            format: 'a4',
            printBackground: true,
            margin : {
                top: 10,
                bottom: 10,
                left: 10,
                right: 10
            }
        });


        await browser.close();
    } catch (err) {
        console.debug('could not create temporary file');
        cleanup( filename );
        res.writeHead(500);
        res.end('could not create temporary file');
        return;
    }

    try {
        const data = fs.readFileSync( filename + '.pdf' );
        cleanup( filename );

        res.writeHead(200, {
            'Content-Type': 'application/pdf'
        });
        res.end(data);
    } catch (err) {
        cleanup( filename );
        res.writeHead(500);
        res.end('could not read file');
        return;
    }
};

const cleanup = function ( basename ) {
    fs.unlink( basename + '.html', (err) => {} );
    fs.unlink( basename + '.pdf', (err) => {} );
};

const server = http.createServer( handleRequest );
server.listen( port, host, () => {
    console.log( ' Server is running... ' );
});
