cmake_minimum_required(VERSION 2.8)
project (jabrachromehost)

file(GLOB sources *.cpp)

include_directories(SDK)

add_compile_options(-std=c++11)

if(WIN32)
  set(CMAKE_CXX_FLAGS_DEBUG "/MTd")
  set(CMAKE_CXX_FLAGS_RELEASE "/MT")
endif()

set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_SOURCE_DIR}/bin)

add_executable(jabrachromehost ${sources})

if(UNIX AND NOT APPLE)
  set(CMAKE_FIND_LIBRARY_SUFFIXES ".so;.so.1.0.11.1;.so.1;.so.2")
endif()

find_library(LIBJABRA
             NAMES jabra libjabra
             PATHS "${CMAKE_SOURCE_DIR}"
             PATH_SUFFIXES "SDKmacOS"
             PATH_SUFFIXES "SDKWindows"
             PATH_SUFFIXES "SDKLinux/32-bit"
             PATH_SUFFIXES "SDKLinux/64-bit")
target_link_libraries(jabrachromehost PUBLIC ${LIBJABRA})
