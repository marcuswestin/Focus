.PHONY: run clean

############
### Apps ###
############

run-tasks:
	make -C lib/fin run-dbs &
	sleep 2;
	cd lib/fin/js/server; node run_server.js &
	cd Tasks; node run_robots.js &

################
### Commands ###
################

deps: lib/fin lib/raphael lib/g.raphael

clean:
	rm -rf lib/*
	touch lib/empty.txt


####################
### Dependencies ###
####################

lib/fin:
	git clone git://github.com/marcuswestin/fin.git
	mv ./fin lib/
	cd lib/fin; make deps

lib/raphael:
	git clone git://github.com/DmitryBaranovskiy/raphael.git
	mv ./raphael lib/
	cd lib/raphael; git checkout 9e3f423e07078e68f8bebe7c5cf2690646e8ec3a

lib/g.raphael:
	git clone git://github.com/DmitryBaranovskiy/g.raphael.git
	mv ./g.raphael lib/
	cd lib/g.raphael; git checkout e9e5e35b9c21d78f3f12aec2da3b8f55dd217542
	