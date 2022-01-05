#!/usr/bin/perl

use v5.24;

use strict;
use warnings;

use MIME::Base64;
use Mojo::File qw(curfile);
use Mojo::UserAgent;

my $html = curfile->sibling('test.html')->slurp;
my $ua   = Mojo::UserAgent->new;
my $tx   = $ua->post(
    'http://localhost:8080',
    json => {
        data => encode_base64( $html )
    }
);

my $pdf = $tx->res->body;
curfile->sibling('response_test.pdf')->spurt( $pdf );

warn $tx->req->to_string;
warn $tx->res->to_string;
