package com.bulletjournal.clients;

import com.bulletjournal.protobuf.daemon.grpc.services.DaemonGrpc;
import com.bulletjournal.protobuf.daemon.grpc.types.JoinGroupEvents;
import net.devh.boot.grpc.client.inject.GrpcClient;
import org.springframework.stereotype.Service;

@Service
public class DaemonServiceClient {

    @GrpcClient("daemonClient")
    private DaemonGrpc.DaemonBlockingStub daemonBlockingStub;

    public String sendEmail(JoinGroupEvents joinGroupEvents) {
//        image build fail @TODO fix
//        try {
//            ReplyMessage replyMessage = this.daemonBlockingStub.joinGroupEvents(joinGroupEvents);
//            return replyMessage.getMessage();
//        } catch (final StatusRuntimeException e) {
//            return "Failed with " + e.getStatus().getCode().name();
//        }
        return "";
    }

}
