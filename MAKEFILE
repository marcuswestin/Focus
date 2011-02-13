all: lib/fin lib/less.js
	cd lib/fin; make all

############
### Cmds ###
############

.PHONY: run
run: all
	redis-server redis.conf &> run-redis-server.out &
	cd lib/fin/; node run_query_observer.js &> ../../run-node-query-observer.out &
	node node_scripts/run_server.js &> run-node-server.out &
	echo "\nFin server running"

.PHONY: stop
stop:
	killall node
	killall redis-server
	echo "\nFin server stopped"

.PHONY: restart
restart: stop run

####################
### Dependencies ###
####################

.PHONY: clean
clean:
	rm -f run-*.out
	rm -rf lib/*
	touch lib/empty.txt

lib/fin:
	git clone git://github.com/marcuswestin/fin.git lib/fin
	cd lib/fin; git checkout v0.1.0; make

lib/less.js:
	curl http://lesscss.googlecode.com/files/less-1.0.18.min.js > lib/less.js
