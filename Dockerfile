FROM mcr.microsoft.com/playwright:focal

RUN mkdir /opt/html2pdf/

RUN chdir /opt/html2pdf && \
  npm install playwright uuid && \
  npx playwright install

COPY html2pdf.js /opt/html2pdf/html2pdf.js

RUN chmod 755 /opt/html2pdf/html2pdf.js

# http://localhost:8080/
EXPOSE 8080
ENTRYPOINT ["/opt/html2pdf/html2pdf.js"]
