// Poco Libraries
#include <Poco/Net/HTTPClientSession.h>
#include <Poco/Net/HTTPRequest.h>
#include <Poco/Net/HTTPResponse.h>
#include <Poco/StreamCopier.h>
#include <Poco/Path.h>
#include <Poco/URI.h>
#include <Poco/Exception.h>
// RapidJSON Libraries
#include "rapidjson/document.h"
#include "rapidjson/writer.h"
#include "rapidjson/stringbuffer.h"
#include "rapidjson/filereadstream.h"
// Standard C++ Libraries
#include <iostream>
#include <exception>
#include <sstream>

void coolResponseHandle(int, std::string, const char *);

void coolAutoSendRequest(char **args) {

    // GET /v2.0/device/<Device_SN>/ls2<&UID_optional> HTTP/1.1

    std::string device_sn = args[1], command = args[2], uid = "";
    if(args[3]) {
        uid = args[3];
    }

    std::string reqStr = "http://localhost:3000/v2.0/device/" + device_sn + "/" + command + "&" + uid;
    std::cout<<"\nURI Endpoint : "<<reqStr<<std::endl;

    try {
        Poco::URI uri(reqStr);
        Poco::Net::HTTPClientSession session(uri.getHost(), uri.getPort());

        std::string path (uri.getPathAndQuery());
        if(path.empty()) {
            path = '/';
        }

        Poco::Net::HTTPRequest req(Poco::Net::HTTPRequest::HTTP_POST, path, Poco::Net::HTTPMessage::HTTP_1_1);
        session.sendRequest(req);

        Poco::Net::HTTPResponse res;
        std::cout<<res.getStatus()<<" "<<res.getReason()<<std::endl<<"Response:\n";

        std::istream &is = session.receiveResponse(res);
        Poco::StreamCopier::copyStream(is, std::cout);
        std::cout<<std::endl;
        std::stringstream ss;
        Poco::StreamCopier::copyStream(is, ss);
        coolResponseHandle(res.getStatus(), res.getReason(), ss.str().c_str());
    } catch(...) {
        std::cout<<"\nError in making request....\n";
    }

}

void coolResponseHandle(int status, std::string reason, const char *resStr) {
    if(status != 200) {
        rapidjson::Document response;
        response.Parse(resStr);
        if (response.HasMember("error")) {
            rapidjson::Value& error = response["error"];
            std::string errStr = "";
            switch(status) {
                case 400:
                    if(strcmp(error.GetString(), "Wrong v1 route") == 0 || strcmp(error.GetString(), "Wrong v2 route") == 0)
                        errStr = "Wrong <Request_str> format";
                    else if(strcmp(error.GetString(), "Wrong API Version"))
                        errStr = "<API Version> is not supported";
                    break;
                case 403:
                    errStr = "<Device_SN> does not match";
                    break;
                case 404:
                    errStr = "URI format is wrong";
                    break;
                case 405:
                    break;
                case 413:
                    errStr = "HTTP request is fragmented";
                    break;
                case 501:
                    break;
            }
            std::cout<<"\nError State:\n-------------";
            std::cout<<"\n\t"<<status<<" : "<<reason;
            std::cout<<"\n\t"<<error.GetString()<< " : "<<errStr;
        }
    }
    else {
        std::cout<<"\nSuccessful Request Made";
        std::cout<<"\nResponse : \n-----------\n"<<resStr<<std::endl;
    }
}

int main(int argc, char **argv) {
    coolAutoSendRequest(argv);
}