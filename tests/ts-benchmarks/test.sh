bench=$1

node ../../build/cli/ts2wasm.js --opt=3 ${bench}.ts -o ${bench}.wasm && \
    ../../runtime-library/deps/wamr-gc/wamr-compiler/build/wamrc --enable-gc -o ${bench}.aot ${bench}.wasm &&
    ../../runtime-library/build/iwasm_gc --stack-size=10000000 --gc-heap-size=50000000 ${bench}.aot
