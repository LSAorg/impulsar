#!/bin/bash
tplant --input packages/client/src/**/*.ts --output uml/client.puml
tplant --input packages/plugin-record/src/**/*.ts --output uml/plugin-record.puml
tplant --input packages/plugin-subtitle/src/**/*.ts --output uml/plugin-subtitle.puml
tplant --input packages/plugin-webgl-render/src/**/*.ts --output uml/plugin-webgl-render.puml
tplant --input packages/server/src/**/*.ts --output uml/server.puml