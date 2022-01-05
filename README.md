# HTML -> PDF with Playwright

The [html2pdf.js](./html2pdf.js) script is a small [node.js](https://nodejs.org/en/)
webserver that uses [Playwright](https://playwright.dev/) to converts HTML to PDF.

If you run the script, a sample POST request should look like

```
POST / HTTP/1.1
User-Agent: Mojolicious (Perl)
Host: localhost:8080
Content-Type: application/json
Content-Length: 73
Accept-Encoding: gzip

{"data":"PGh0bWw+Cjxib2R5Pgo8aDE+VGVzdDwvaDE+CjwvYm9keT4KPC9odG1sPgo=\n"}
```

And it returns the PDF.

## Using docker

To use a [docker](https://www.docker.com/) container to do the conversion, you can use

```
$ docker pull html2pdf:latest
$ docker run -p 8080:8080 html2pdf:latest
```
