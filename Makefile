############
### Apps ###
############

.PHONY: run-tasks
run-tasks:
	redis-server lib/fin/redis.conf &
	cd lib/fin/; node run_query_observer.js &
	node run_server.js &

.PHONY: stop-tasks
stop-tasks:
	killall node
	killall redis-server

.PHONY: restart-tasks
restart-tasks: stop-tasks run-tasks

####################
### Dependencies ###
####################

.PHONY: deps
deps: lib/fin lib/raphael lib/g.raphael

.PHONY: clean
clean:
	rm -rf lib/*
	touch lib/empty.txt

lib/fin:
	git clone git://github.com/marcuswestin/fin.git
	mv ./fin lib/
	cd lib/fin; make download-dependencies

lib/raphael:
	git clone git://github.com/DmitryBaranovskiy/raphael.git
	mv ./raphael lib/
	cd lib/raphael; git checkout 9e3f423e07078e68f8bebe7c5cf2690646e8ec3a

lib/g.raphael:
	git clone git://github.com/DmitryBaranovskiy/g.raphael.git
	mv ./g.raphael lib/
	cd lib/g.raphael; git checkout e9e5e35b9c21d78f3f12aec2da3b8f55dd217542
	