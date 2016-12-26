#! /bin/bash

### 
# nas1 default_password: Yskj2407 uid,gid should be fixed
mount -t cifs //nas.intern.lambdacal.com/homes/szhang   /home/szhang/data           -o uid=1000,gid=100,dir_mode=0755,username=szhang,password=Yskj2407
mount -t cifs //nas.intern.lambdacal.com/software       /home/szhang/nas/software   -o uid=1000,gid=100,dir_mode=0755,username=szhang,password=Yskj2407
mount -t cifs //nas.intern.lambdacal.com/documents      /home/szhang/nas/documents  -o uid=1000,gid=100,dir_mode=0755,username=szhang,password=Yskj2407

mount -t cifs //nas.intern.lambdacal.com/homes/szhang/store store                   -o uid=1000,gid=100,dir_mode=0755,username=szhang,password=Yskj2407

# nas2 default_password: yskj2407
mount -t cifs //nas2.intern.lambdacal.com/homes/szhang  /home/szhang/data2          -o uid=1000,gid=100,dir_mode=0755,username=szhang,password=yskj2407

# local disk
mount /dev/sda5 /home/szhang/sda5 -o uid=1000,gid=100,dir_mode=0755
