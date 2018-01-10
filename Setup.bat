
cmd /c npm update

cmd /c composer update

php artisan key:generate

php artisan migrate

php artisan db:seed

php artisan storage:link

php artisan vendor:publish

mkdir public/uploads

REM TODO: enable the fileinfo php extension
REM TODO: edit php.ini and the nginx.conf files to raise the post and upload size limits