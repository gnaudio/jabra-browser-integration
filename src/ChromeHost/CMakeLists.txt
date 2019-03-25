cmake_minimum_required(VERSION 2.8)
project (jabrachromehost)

file(GLOB sources *.cpp)

include_directories(SDK
                    include)

add_compile_options(-std=c++14)

if(WIN32)
  set(CMAKE_CXX_FLAGS_DEBUG "/MTd /Zi")
  set(CMAKE_CXX_FLAGS_RELEASE "/MT /Zi")
endif()

if(APPLE)
  set(CMAKE_VERBOSE_MAKEFILE ON) 
  SET(CMAKE_SKIP_BUILD_RPATH  TRUE)
  SET(CMAKE_BUILD_WITH_INSTALL_RPATH TRUE)  
  set(CMAKE_INSTALL_RPATH "@executable_path/./")
  set(CMAKE_INSTALL_RPATH_USE_LINK_PATH TRUE)
endif()

set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_SOURCE_DIR}/bin)

add_executable(jabrachromehost ${sources})

if(UNIX AND NOT APPLE)
  set(CMAKE_EXE_LINKER_FLAGS "${CMAKE_EXE_LINKER_FLAGS} -pthread")
  set(CMAKE_FIND_LIBRARY_SUFFIXES ".so;.so.1.0.11.1;.so.1;.so.2;.so.1.7.3.4")
  set(CMAKE_EXE_LINKER_FLAGS "${CMAKE_EXE_LINKER_FLAGS} -Wl,-rpath='$ORIGIN'")
endif()

find_library(LIBJABRA
             NAMES jabra libjabra
             PATHS "${CMAKE_SOURCE_DIR}"
             PATH_SUFFIXES "SDKmacOS"
             PATH_SUFFIXES "SDKWindows"
             PATH_SUFFIXES "SDKLinux/64-bit")
target_link_libraries(jabrachromehost PUBLIC ${LIBJABRA})
