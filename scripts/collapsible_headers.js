
 document.addEventListener('DOMContentLoaded', function () {
   const headers = document.querySelectorAll('.collapsible-header');
   headers.forEach(header => {
     header.addEventListener('click', () => {
       const content = header.nextElementSibling;
       content.classList.toggle('open');
       header.classList.toggle('active');
     });
   });
 });
