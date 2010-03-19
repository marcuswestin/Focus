.PHONY: run clean

################
### Commands ###
################

deps: lib/fin

run-dbs:
	make -C lib/fin run-dbs

run:
	cd lib/fin/js/server; node run_server.js

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
