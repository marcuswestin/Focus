############
### Apps ###
############

.PHONY: run
run: lib/fin
	redis-server lib/fin/redis.conf &
	cd lib/fin/; node run_query_observer.js &
	node run_server.js &

.PHONY: stop-tasks
stop:
	killall node
	killall redis-server

.PHONY: restart-tasks
restart: stop run

####################
### Dependencies ###
####################

.PHONY: deps
deps: lib/fin

.PHONY: clean
clean:
	rm -rf lib/*
	touch lib/empty.txt

lib/fin:
	git clone git://github.com/marcuswestin/fin.git
	mv ./fin lib/
	cd lib/fin; make download-dependencies
