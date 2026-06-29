-- Expand approved teacher emails to CEWA plus WA school subdomains.
-- Example allowed domains: cewa.edu.au, education.wa.edu.au, tkc.wa.edu.au.

alter table if exists teachers
drop constraint if exists teachers_email_domain_check;

alter table if exists teachers
add constraint teachers_email_domain_check
check (
  email_domain = 'cewa.edu.au'
  or email_domain like '%.wa.edu.au'
);
